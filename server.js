const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;

async function getAuth() {
    const credentials = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
    });
    return await auth.getClient();
}

function generatePasscode(workerId) {
    const suffix = crypto.randomBytes(4).toString('hex').toUpperCase().substring(0, 6);
    let id_part = String(workerId);
    if (!isNaN(parseInt(workerId))) {
        id_part = `W${String(parseInt(workerId)).padStart(2, '0')}`;
    }
    return `EXP1-${id_part}-${suffix}`;
}

async function getOrCreateSpreadsheetId(auth, sheetName) {
    const drive = google.drive({ version: 'v3', auth });
    
    // Search for the spreadsheet by name
    const searchRes = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.spreadsheet' and name='${sheetName}' and trashed=false`,
        fields: 'files(id, name)',
    });

    if (searchRes.data.files.length > 0) {
        return searchRes.data.files[0].id;
    } else {
        // Create the spreadsheet if it doesn't exist
        const createRes = await drive.files.create({
            resource: {
                name: sheetName,
                mimeType: 'application/vnd.google-apps.spreadsheet',
            },
            fields: 'id',
        });
        return createRes.data.id;
    }
}

async function ensureHeader(sheets, spreadsheetId, header) {
    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!1:1',
        });
        if (!res.data.values || res.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: 'Sheet1!A1',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [header],
                },
            });
        }
    } catch (e) {
        if (e.message.includes("unable to parse range")) { // Sheet1 does not exist
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: "Sheet1",
                            }
                        }
                    }]
                }
            });
            await ensureHeader(sheets, spreadsheetId, header); // retry header
        } else {
            throw e;
        }
    }
}


app.post('/api/save-results', async (req, res) => {
    try {
        const { responses, userId } = req.body;
        if (!responses || !userId) {
            return res.status(400).send({ message: "Missing 'userId' or 'responses' in request." });
        }

        const auth = await getAuth();
        const sheets = google.sheets({ version: 'v4', auth });
        const sheetName = process.env.GOOGLE_SHEET_NAME || 'EXP1-main';

        const spreadsheetId = await getOrCreateSpreadsheetId(auth, sheetName);
        if (!spreadsheetId) {
            return res.status(500).send({ message: 'Could not create or find Google Sheet.' });
        }

        const passcode = generatePasscode(userId);

        const na = (value) => {
            if (value === null || value === undefined || value === '') return 'N/A';
            if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'N/A';
            return value;
        };
        
        const header = [
            'User ID', 'Passcode', 'Trial Index', 'Keyword', 'Situation', 'Question',
            'Event - Part 1 Answer',
            'Event - Part 2 Candidate Choice', 'Event - Part 2 Satisfaction', 'Event - Part 2 Improvement Feedback', 'Event - Part 2 Improvement Other',
            'Event - Part 3 Unchosen Feedback', 'Event - Part 3 Other',
            'Property - Part 4 Answer',
            'Property - Part 5 Candidate Choice', 'Property - Part 5 Satisfaction', 'Property - Part 5 Improvement Feedback', 'Property - Part 5 Improvement Other',
            'Property - Part 6 Unchosen Feedback', 'Property - Part 6 Other',
            'Emotion - Part 7 Answer',
            'Emotion - Part 8 Candidate Choice', 'Emotion - Part 8 Satisfaction', 'Emotion - Part 8 Improvement Feedback', 'Emotion - Part 8 Improvement Other',
            'Emotion - Part 9 Unchosen Feedback', 'Emotion - Part 9 Other'
        ];

        const rows = responses.map(trialData => ([
            na(userId),
            na(passcode),
            na(trialData?.trialIndex),
            na(trialData?.keyword),
            na(trialData?.situation),
            na(trialData?.question),
            na(trialData?.part1?.answer),
            na(trialData?.part2?.candidateChoice),
            na(trialData?.part2?.satisfaction),
            na(trialData?.part2?.improvementFeedback),
            na(trialData?.part2?.improvementFbNoneText),
            na(trialData?.part3?.unchosenFeedback),
            na(trialData?.part3?.fbNoneText),
            na(trialData?.part4?.finalAnswer),
            na(trialData?.part5?.candidateChoice),
            na(trialData?.part5?.satisfaction),
            na(trialData?.part5?.improvementFeedback),
            na(trialData?.part5?.improvementFbNoneText),
            na(trialData?.part6?.unchosenFeedback),
            na(trialData?.part6?.fbNoneText),
            na(trialData?.part7?.answer),
            na(trialData?.part8?.candidateChoice),
            na(trialData?.part8?.satisfaction),
            na(trialData?.part8?.improvementFeedback),
            na(trialData?.part8?.improvementFbNoneText),
            na(trialData?.part9?.unchosenFeedback),
            na(trialData?.part9?.fbNoneText)
        ]));

        await ensureHeader(sheets, spreadsheetId, header);

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: rows,
            },
        });

        res.status(200).send({ status: "success", message: 'Data saved successfully.', passcode });

    } catch (error) {
        console.error('Error saving data to Google Sheet:', error);
        res.status(500).send({ status: "error", message: 'Error saving data to Google Sheet.', error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
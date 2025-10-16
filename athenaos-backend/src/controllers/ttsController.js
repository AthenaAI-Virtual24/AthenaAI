const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

let textToSpeechClient;

try {
  if (process.env.GOOGLE_CREDENTIALS_BASE64) {
    const credentialsJson = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    const credentials = JSON.parse(credentialsJson);
    textToSpeechClient = new TextToSpeechClient({ credentials });
  } else {
    textToSpeechClient = new TextToSpeechClient();
  }
} catch (error) {
  console.error('Failed to initialize TextToSpeechClient:', error);
}


exports.synthesizeSpeech = async (req, res) => {
  if (!textToSpeechClient) {
    return res.status(500).send('Text-to-Speech client not initialized');
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    
    res.json({ audioContent: response.audioContent.toString('base64') });

  } catch (error) {
    console.error('ERROR synthesizing speech:', error);
    res.status(500).send('Failed to synthesize speech');
  }
};
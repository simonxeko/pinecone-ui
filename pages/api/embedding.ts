import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
  apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Query embed:", req.body.input);
    const embedding = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: req.body.input,
      user: 'simon',
    });
    
    res.json({
      query: req.body.input,
      result: embedding.data.data[0]
    })
}

export default handler

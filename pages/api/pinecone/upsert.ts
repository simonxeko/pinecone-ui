import { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from "@pinecone-database/pinecone";
import uuid4 from 'uuid4';
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENV,
        apiKey: process.env.PINECONE_APIKEY,
    });

    const index = pinecone.Index(req.body.index);
    const { id, text } = req.body;

    const embedding = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: text,
        user: 'simon',
    });

    const obj = {
        id: !!id ? id : uuid4(),
        values: embedding.data.data[0].embedding,
        metadata: {
            text: text,
        }
    };
    const queryResponse = await index.upsert({ 
        upsertRequest: {
            vectors: [obj]
        },
    });
    res.status(200).json(queryResponse);
}

export default handler
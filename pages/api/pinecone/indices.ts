import { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from "@pinecone-database/pinecone";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENV,
        apiKey: process.env.PINECONE_APIKEY,
    });

    const indices = await pinecone.listIndexes();
    res.status(200).json({ indices });
}

export default handler

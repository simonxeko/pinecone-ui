import { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from "@pinecone-database/pinecone";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENV,
        apiKey: process.env.PINECONE_APIKEY,
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);
    const { id } = req.body;
    const queryResponse = await index.delete1({ ids: [id] });
    res.status(200).json({ success: true });
}

export default handler

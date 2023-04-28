import { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from "@pinecone-database/pinecone";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENV,
        apiKey: process.env.PINECONE_APIKEY,
    });

    const index = pinecone.Index(req.body.index);
    const { id } = req.body;
    if (!id) {
        res.status(200).json({ error: "No id provided" });
        return;
    }
    const queryResponse = await index.fetch({ ids: [id] });
    res.status(200).json(queryResponse.vectors[id]);
}

export default handler;

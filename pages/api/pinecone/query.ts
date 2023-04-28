import { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from "@pinecone-database/pinecone";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENV,
        apiKey: process.env.PINECONE_APIKEY,
    });

    const index = pinecone.Index(req.body.index);
    const vector = JSON.parse(req.body.vector);
    const topK = parseInt(req.body.topK) || 10;
    console.log(vector.length, topK);
    const queryRequest = {
        vector,
        topK,
        includeMetadata: true,
        // filter: {
        //     genre: { $in: ["comedy", "documentary", "drama"] },
        // },
        // namespace: "example-namespace",
    };
    const queryResponse = await index.query({ queryRequest });
    res.status(200).json(queryResponse);
}

export default handler

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.query.secret !== process.env.NEXT_REVALIDATE_SECRET_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const path = req.query.path as string;
    if (!path) {
        return res.status(400).json({ message: 'path missing' });
    }
    try {
        await res.revalidate(path);
        if (path === '/') {
            await res.revalidate('/archive');
        }
        return res.json({ revalidated: true });
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating');
    }
}
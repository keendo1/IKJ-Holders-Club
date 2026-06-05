import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const { address, name, shippingAddress } = req.body;

  const { error } = await supabase
    .from('contestants')
    .insert([{ wallet_address: address, name, shipping_address: shippingAddress }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: 'Registration successful' });
}
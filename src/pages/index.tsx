import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAccount, useReadContract } from 'wagmi';
import styles from '../styles/Home.module.css';

const CONTRACT_ADDRESS = '0xaE6Ae5F5639FF8E52d9F4f6c9cC9ee38aD59F997';
const balanceOfABI = [{
  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
}];

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: balanceOfABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  const isHolder = isConnected && balance && BigInt(balance as bigint) > 0n;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch('/api/register-contest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        name: formData.get('name'),
        shippingAddress: formData.get('shippingAddress'),
      }),
    });
    if (response.ok) alert('Successfully registered for the contest!');
    else alert('Registration failed.');
  };

  return (
    <div className={styles.container}>
      <Head><title>Immortal King Jesus | IP Portal</title></Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Immortal King Jesus</h1>
        <ConnectButton />
        {isConnected && isHolder ? (
          <form onSubmit={handleSubmit} className={styles.card} style={{ marginTop: '20px' }}>
            <h2>Contest Registration</h2>
            <input name="name" placeholder="Full Name" required />
            <input name="shippingAddress" placeholder="Shipping Address" required />
            <button type="submit">Submit Entry</button>
          </form>
        ) : isConnected ? <p>No IKJ tokens detected.</p> : <p>Connect wallet to enter.</p>}
      </main>
    </div>
  );
};
export default Home;
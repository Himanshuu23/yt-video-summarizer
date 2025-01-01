import Image from 'next/image';
import Head from 'next/head';

export default function HeroSection() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px', backgroundColor: 'black' }}>
        <div style={{ color: '#fff', fontFamily: "'Poppins', sans-serif", maxWidth: '50%' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.2' }}>
            LEARN TO CODE <span style={{ color: '#FFA500' }}>FASTER.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.6', marginTop: '20px' }}>
            Fireship is a <span style={{ color: '#FFD700', fontWeight: 'bold' }}>blazingly fast</span> && 
            <span style={{ color: '#FF69B4', fontWeight: 'bold' }}> highly-amusing</span> way to level up your programming skills.
          </p>
          <input
            type="text"
            placeholder="Enter your email"
            style={{
              marginTop: '20px',
              padding: '10px',
              width: '80%',
              border: '2px solid #FFA500',
              borderRadius: '5px',
              fontSize: '1rem',
              fontFamily: "'Poppins', sans-serif",
            }}
          />
          <button style={{ marginTop: '20px', padding: '15px 30px', backgroundColor: '#00FF00', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            START HERE
          </button>
        </div>
        <div style={{ position: 'relative', width: '400px', height: '300px' }}>
          <Image src="/hero.jpg" alt="Hero Image" layout="fill" objectFit="cover" />
        </div>
      </div>
    </>
  );
}

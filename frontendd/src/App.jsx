import React, { useState, useEffect, useCallback } from 'react';
// This application is compiled into a single file, relying on the window.ethers object
// being available after the CDN script loads.

// --- Assets and Configuration ---

// Placeholder URLs for images (since local file paths won't work in a single React file demo)
const HERB_IMAGE = "https://placehold.co/420x260/e9fce9/0f2b1b?text=Ayur+Chain+Image";
const ASHWAGANDHA_IMAGE = "https://placehold.co/260x180/d9f1d9/0f2b1b?text=Ashwagandha";
const BRAHMI_IMAGE = "https://placehold.co/260x180/d9f1d9/0f2b1b?text=Brahmi+Leaves";
const TURMERIC_IMAGE = "https://placehold.co/260x180/d9f1d9/0f2b1b?text=Turmeric";

// Contract Details (Replace with YOUR actual deployed address)
// IMPORTANT: Update this address after successfully running "npx hardhat run scripts/deploy.cjs --network localhost"
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

const contractABI = [
  {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_location","type":"string"}],"name":"addItem","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getItem","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"collector","type":"address"}],"internalType":"struct Provenance.Item","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"itemCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

// --- Utility Hooks ---
const useEthersLoader = () => {
    const [isEthersLoaded, setIsEthersLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState(null);

    useEffect(() => {
        const scriptUrl = "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
        let interval;

        const checkEthers = () => {
            if (typeof window !== 'undefined' && window.ethers) {
                console.log('✅ Ethers.js loaded successfully');
                setIsEthersLoaded(true);
                clearInterval(interval);
                return;
            }
        };

        if (typeof window !== 'undefined' && window.ethers) {
            setIsEthersLoaded(true);
            return;
        }

        let existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
        
        if (!existingScript) {
            console.log('📥 Loading Ethers.js...');
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.async = true;
            
            script.onerror = () => {
                setLoadingError('Failed to load Ethers CDN');
                setIsEthersLoaded(true); 
            };
            document.head.appendChild(script);
        }

        interval = setInterval(checkEthers, 200);

        setTimeout(() => {
            if (!window.ethers) {
                 setLoadingError('Loading timed out. Check network connection.');
                 clearInterval(interval);
                 setIsEthersLoaded(true); // Proceed with error state
            }
        }, 5000); 

        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return { isEthersLoaded, loadingError };
};

// --- Sub Components (Pages) ---

const Navbar = ({ navigate, openLogin }) => (
  <header className="navbar" role="banner" aria-label="Main navigation">
    <div className="logo">🌱 AyurChain</div>
    <nav>
      <button className="nav-link" onClick={() => navigate('home')}>Home</button>
      <button className="nav-link" onClick={() => navigate('middleman')}>Middleman</button>
      <button className="nav-link" onClick={() => navigate('quality')}>Quality</button>
      <a href="#" className="nav-link icon" aria-label="search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="6.2" stroke="white" strokeWidth="1.6" fill="none" />
        </svg>
      </a>
    </nav>
    <div className="login-floating">
      <button className="btn primary login-btn" onClick={openLogin}>Login</button>
    </div>
  </header>
);

const HomePage = ({ navigate }) => (
    <>
        <section className="hero" role="region" aria-label="Main hero">
            <div className="hero-text">
                <h1>From Farm to Formula 🌱</h1>
                <p className="tagline">"Knowing an herb's journey is the first step toward trusting what you take."</p>
                <p className="lead">Experience 100% transparency in Ayurvedic herbs — trace every step from the farmer's field to your medicine pack using Blockchain & QR codes.</p>
                <div className="buttons">
                    <button className="btn primary">🔎 Scan</button>
                    <button className="btn secondary">📊 Explore Dashboard</button>
                </div>
            </div>
            <div className="hero-image" aria-hidden="true">
                <img src={HERB_IMAGE} alt="Ayurvedic herbs" onError={(e) => e.target.src = HERB_IMAGE} />
            </div>
        </section>
        <section className="features" role="region" aria-label="Features">
            <h2>Why AyurChain?</h2>
            <div className="feature-grid">
                <div className="card">
                    <h3>🌱 Farmers</h3>
                    <p>Geo-tagged harvesting ensures authenticity and fair pricing for every farmer.</p>
                    <img src={ASHWAGANDHA_IMAGE} alt="Ashwagandha" className="feature-img" onError={(e) => e.target.src = ASHWAGANDHA_IMAGE}/>
                </div>
                <div className="card">
                    <h3>🧪 Labs</h3>
                    <p>Quality tests and safety certificates recorded forever on blockchain.</p>
                    <img src={TURMERIC_IMAGE} alt="Turmeric" className="feature-img" onError={(e) => e.target.src = TURMERIC_IMAGE}/>
                </div>
                <div className="card">
                    <h3>🏭 Processors</h3>
                    <p>Track every processing step: drying, grinding, storage, packaging.</p>
                    <img src={BRAHMI_IMAGE} alt="Brahmi Leaves" className="feature-img" onError={(e) => e.target.src = BRAHMI_IMAGE}/>
                </div>
                <div className="card">
                    <h3>👩‍⚕ Consumers</h3>
                    <p>Scan the QR to reveal the herb's full life story — pure, safe & trustworthy.</p>
                    <img src={HERB_IMAGE} alt="Herbs" className="feature-img" onError={(e) => e.target.src = HERB_IMAGE}/>
                </div>
            </div>
        </section>
        <section className="cta" role="region" aria-label="Call to action">
            <h2>🌿 Bringing Trust Back to Ayurveda</h2>
            <p>Join us in building a healthier future with transparent, authentic herbal medicine.</p>
            <button className="btn primary">Get Started</button>
        </section>
        <footer className="site-footer" role="contentinfo">
            <p>© 2025 AyurChain</p>
        </footer>
    </>
);

const MiddlemanPage = ({ navigate }) => {
    const [middlemanName, setMiddlemanName] = useState('');
    const [batchId, setBatchId] = useState('');
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blockchainStatus, setBlockchainStatus] = useState('unconnected'); // Changed initial state

    // Mock data for demo
    const mockData = [
        { middlemanName: "Ram Farmers Coop", batchIds: ["RMF001", "RMF002"] },
        { middlemanName: "Green Valley Herbs", batchIds: ["GVH003"] },
        { middlemanName: "Organic Traders Ltd", batchIds: ["OTL004", "OTL005"] }
    ];

    const connectWalletAndFetch = useCallback(async () => {
        const ethers = window.ethers;
        setLoading(true);
        setError(null);
        setBlockchainStatus('checking');
        
        if (!ethers || !window.ethereum) {
            setBlockchainStatus(ethers ? 'no-metamask' : 'no-ethers'); 
            setDataList(mockData);
            setLoading(false);
            return;
        }

        try {
            // 1. Force MetaMask connection immediately
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Prompts user to connect

            const network = await provider.getNetwork();
            // Check if chain ID is the Hardhat default (31337)
            if (Number(network.chainId) !== 31337) {
                setBlockchainStatus('wrong-network');
                throw new Error(`Wrong network. Expected: 31337, Got: ${Number(network.chainId)}`);
            }

            const provenanceContract = new ethers.Contract(contractAddress, contractABI, provider);
            
            const count = await provenanceContract.itemCount();
            
            const items = [];
            for (let i = 0; i < count; i++) {
                const item = await provenanceContract.getItem(i);
                items.push(item);
            }

            const middlemanMap = new Map();
            items.forEach(item => {
                const name = item.name;
                const location = item.location;
                if (!middlemanMap.has(name)) {
                    middlemanMap.set(name, []);
                }
                middlemanMap.get(name).push(location);
            });

            const formattedData = Array.from(middlemanMap.entries()).map(([name, batches]) => ({
                middlemanName: name,
                batchIds: batches
            }));
            
            setDataList(formattedData);
            setBlockchainStatus('connected');
            setError(null);

        } catch (err) {
            console.error("Error connecting or fetching data:", err);
            setDataList(mockData);

            if (err.code === 4001) {
                setError("MetaMask connection rejected by user. Click Connect Wallet to try again.");
                setBlockchainStatus('user-rejected');
            } else if (blockchainStatus === 'wrong-network') {
                 setError("Please switch MetaMask to Localhost 8545.");
            } else {
                setError("Connection failed. Ensure Hardhat Node is running (8545) and contract address is correct.");
                setBlockchainStatus('error');
            }
        } finally {
            setLoading(false);
        }
    }, [blockchainStatus]);

    useEffect(() => {
        // Only run when component loads, user must click button to connect
        setLoading(false); 
        setDataList(mockData);
    }, []); 

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!middlemanName || !batchId) return;
        
        if (blockchainStatus !== 'connected') {
            alert(`Demo Mode: Cannot send transaction. Status: ${getStatusMessage()}. Click Connect Wallet to enable.`);
            // Fallback to demo mode state change
            const existingEntry = dataList.find(entry => entry.middlemanName === middlemanName);
            if (existingEntry) {
                existingEntry.batchIds.push(batchId);
                setDataList([...dataList]);
            } else {
                setDataList([...dataList, { middlemanName, batchIds: [batchId] }]);
            }
            setMiddlemanName('');
            setBatchId('');
            return;
        }

        const ethers = window.ethers;
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const provenanceContract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await provenanceContract.addItem(middlemanName, batchId);
            alert(`Sending transaction... Hash: ${tx.hash}`);
            await tx.wait();
            
            alert(`Transaction successful! Item added: ${middlemanName} - ${batchId}`);
            setMiddlemanName('');
            setBatchId('');
            connectWalletAndFetch(); // Refresh data immediately after successful transaction
        } catch (err) {
            console.error("Error adding item:", err);
            alert(`Transaction failed. Check console for error details.`);
        }
    };

    const getStatusMessage = () => {
        switch (blockchainStatus) {
            case 'connected':
                return '🟢 Blockchain Connected';
            case 'no-metamask':
                return '🟡 MetaMask Required';
            case 'wrong-network':
                return '🔴 Wrong Network. Switch to Localhost 8545.';
            case 'user-rejected':
                return '🔴 MetaMask Connection Rejected.';
            case 'error':
            case 'network-error':
                return '🔴 Connection Error. Is Hardhat running?';
            case 'no-ethers':
                return '🔴 Loading Error. Please hard refresh.';
            case 'unconnected':
            default:
                return '⚫ Disconnected. Click below to connect.';
        }
    };

    const isConnectionActionNeeded = blockchainStatus !== 'connected' && blockchainStatus !== 'checking';

    return (
        <div className="container middleman-page">
            <h2>Middleman Registration</h2>
            
            {/* Blockchain Status Indicator */}
            <div style={{ 
                marginBottom: '20px', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '14px',
                backgroundColor: blockchainStatus === 'connected' ? '#dcfce7' : '#fef3c7',
                color: blockchainStatus === 'connected' ? '#166534' : '#92400e',
                border: `1px solid ${blockchainStatus === 'connected' ? '#bbf7d0' : '#fde047'}`
            }}>
                Status: {getStatusMessage()}
                {isConnectionActionNeeded && (
                    <button 
                        className="btn primary" 
                        onClick={connectWalletAndFetch}
                        style={{ marginTop: '10px', padding: '8px 12px', width: '100%' }}
                    >
                        Connect Wallet & Load Data
                    </button>
                )}
            </div>

            <form id="middlemanForm" onSubmit={handleFormSubmit}>
                <div className="form-row">
                    <input type="text" placeholder="Enter middleman name" id="middlemanName" value={middlemanName} onChange={(e) => setMiddlemanName(e.target.value)} required />
                    <input type="text" placeholder="Enter batch ID" id="batchId" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
                </div>
                <button type="submit" className="add-btn">➕ Add</button>
            </form>

            <div id="dataList" className="data-list">
                {loading && <p className='loading-msg'>Loading data...</p>}
                {error && <p className='error-msg'>{error}</p>}
                {!loading && dataList.length === 0 && !error && (
                    <p className='empty-msg'>No entries yet. Add your first middleman!</p>
                )}
                {dataList.map((item, index) => (
                    <div key={index} className="data-item">
                        <strong>{item.middlemanName}</strong>: {item.batchIds.join(", ")}
                    </div>
                ))}
            </div>

            <div className="btn-row">
                <button className="next-btn" onClick={() => navigate('quality')}>Next ➡</button>
            </div>
        </div>
    );
};

const QualityAnalysisPage = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatches, setSelectedBatches] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for demo
    const mockBatches = [
        { middlemanName: "Ram Farmers Coop", batchIds: ["RMF001", "RMF002"] },
        { middlemanName: "Green Valley Herbs", batchIds: ["GVH003"] },
        { middlemanName: "Organic Traders Ltd", batchIds: ["OTL004", "OTL005"] }
    ];

    const fetchBatches = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (window.ethereum && window.ethers) {
                const provider = new window.ethers.BrowserProvider(window.ethereum);
                const provenanceContract = new window.ethers.Contract(contractAddress, contractABI, provider);
                const count = await provenanceContract.itemCount();

                const items = [];
                for (let i = 0; i < count; i++) {
                    const item = await provenanceContract.getItem(i);
                    items.push(item);
                }

                const middlemanMap = new Map();
                items.forEach(item => {
                    const name = item.name;
                    const location = item.location;
                    if (!middlemanMap.has(name)) {
                        middlemanMap.set(name, []);
                    }
                    middlemanMap.get(name).push(location);
                });

                const formattedData = Array.from(middlemanMap.entries()).map(([name, batchIds]) => ({
                    middlemanName: name,
                    batchIds: batchIds
                }));

                setBatches(formattedData);
            } else {
                setBatches(mockBatches);
                setError("Demo mode: Using sample data");
            }
        } catch (err) {
            console.error("Error fetching batches:", err);
            setBatches(mockBatches);
            if (err.code === 4001) {
                setError("MetaMask connection rejected. Using demo data.");
            } else {
                setError("Demo mode: Using sample data");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

    const handleCheckboxChange = (batchId, isChecked) => {
        const newSelected = new Set(selectedBatches);
        if (isChecked) {
            newSelected.add(batchId);
        } else {
            newSelected.delete(batchId);
        }
        setSelectedBatches(newSelected);
    };

    const handleSubmit = () => {
        if (selectedBatches.size === 0) {
            alert("⚠ Please select at least one batch before submitting.");
            return;
        }

        const selectedArray = Array.from(selectedBatches);
        alert("✅ Approving batches on the blockchain (Placeholder): " + selectedArray.join(", "));

        setBatches(prevBatches => {
            return prevBatches.map(entry => ({
                ...entry,
                batchIds: entry.batchIds.filter(id => !selectedBatches.has(id))
            })).filter(entry => entry.batchIds.length > 0);
        });
        setSelectedBatches(new Set());
    };

    return (
        <div className="container analysis-page">
            <div className="card">
                <h2>Quality Analysis</h2>
                <p>Select the batches you want to approve</p>
                <div id="batchList" className="batch-list">
                    {loading && <p className='loading-msg'>Loading batches...</p>}
                    {error && <p className='error-msg'>{error}</p>}
                    {!loading && batches.length === 0 && !error && (
                        <p style={{ color: 'gray' }}>No batch data found on the blockchain.</p>
                    )}
                    {batches.map((entry, index) => (
                        entry.batchIds.map((batch, subIndex) => (
                            <div key={`${index}-${subIndex}`} className="batch-item">
                                <input
                                    type="checkbox"
                                    className="batch-checkbox"
                                    value={batch}
                                    checked={selectedBatches.has(batch)}
                                    onChange={(e) => handleCheckboxChange(batch, e.target.checked)}
                                />
                                <span><strong>{entry.middlemanName}</strong> - {batch}</span>
                            </div>
                        ))
                    ))}
                </div>
                <button id="submitBtn" className="submit-btn" onClick={handleSubmit}>✅ Submit</button>
            </div>
        </div>
    );
};

const LoginModal = ({ isOpen, onClose, onGotoSignup, navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userState, setUserState] = useState({});

    const handleLogin = (e) => {
        e.preventDefault();
        const storedEmail = userState.email || 'demo@ayurchain.com';
        const storedPwd = userState.password || 'demo123';
        const storedName = userState.name || 'Demo User';

        if (email === storedEmail && password === storedPwd) {
            alert('Login successful! Welcome, ' + storedName);
            onClose();
            navigate('middleman');
        } else {
            alert('Invalid email or password. Try: demo@ayurchain.com / demo123');
        }
    };

    if (!isOpen) return null;

    return (
        <div id="loginModal" className="modal" aria-hidden="false" style={{ display: 'flex' }}>
            <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
                <button className="modal-close" onClick={onClose} aria-label="Close login">✕</button>
                <h3 id="loginTitle">Sign in to AyurChain</h3>
                <form id="loginForm" onSubmit={handleLogin}>
                    <label htmlFor="loginEmail">Email</label>
                    <input id="loginEmail" type="email" placeholder="demo@ayurchain.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="loginPwd">Password</label>
                    <input id="loginPwd" type="password" placeholder="demo123" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="btn primary" id="loginSubmit" type="submit">Sign in</button>
                </form>
                <p className="modal-note">Not registered? <button className="inline-link" onClick={onGotoSignup}>Create an account</button></p>
            </div>
        </div>
    );
};

const SignupModal = ({ isOpen, onClose, onGotoLogin }) => {
    const [name, setName] = useState('');
    const [organization, setOrganization] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        if (!name || !phone || !email || !password || !confirmPassword) {
            alert('Please fill all required fields.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // For demo, just save locally for the login check
        localStorage.setItem('hc_user_name', name);
        localStorage.setItem('hc_user_org', organization);
        localStorage.setItem('hc_user_phone', phone);
        localStorage.setItem('hc_user_email', email);
        localStorage.setItem('hc_user_pwd', password);

        alert('Registration successful! Please sign in.');
        onGotoLogin();
    };
    
    if (!isOpen) return null;

    return (
        <div id="signupModal" className="modal" aria-hidden="false" style={{ display: 'flex' }}>
            <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="signupTitle">
                <button className="modal-close" onClick={onClose} aria-label="Close signup">✕</button>
                <h3 id="signupTitle">Create an account</h3>
                <form id="signupForm" onSubmit={handleRegister}>
                    <label htmlFor="regName">Full name</label>
                    <input id="regName" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <label htmlFor="regOrg">Organization / Cooperative (optional)</label>
                    <input id="regOrg" type="text" placeholder="Kisan Coop / Individual" value={organization} onChange={(e) => setOrganization(e.target.value)} />
                    <label htmlFor="regPhone">Phone</label>
                    <input id="regPhone" type="tel" placeholder="+91 9XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <label htmlFor="regEmail">Email</label>
                    <input id="regEmail" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="regPwd">Password</label>
                    <input id="regPwd" type="password" placeholder="Choose a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="regPwd2">Confirm password</label>
                    <input id="regPwd2" type="password" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button className="btn primary" id="registerSubmit" type="submit">Register</button>
                </form>
                <p className="modal-note">Already registered? <button className="inline-link" onClick={onGotoLogin}>Sign in</button></p>
            </div>
        </div>
    );
};

// --- Main App Component ---

const PAGES = {
    home: HomePage,
    middleman: MiddlemanPage,
    quality: QualityAnalysisPage
};

const App = () => {
    const { isEthersLoaded, loadingError } = useEthersLoader();
    const [currentPage, setCurrentPage] = useState('home');
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    
    // Ensure the body has the transition class
    useEffect(() => {
        document.body.classList.add('loaded');
    }, []);

    const CurrentPage = PAGES[currentPage];

    // Simple routing implementation using state and switch/case logic
    const navigate = (page) => {
        setCurrentPage(page);
    };

    const handleLoginOpen = () => setLoginModalOpen(true);
    const handleLoginClose = () => setLoginModalOpen(false);
    const handleSignupClose = () => setSignupModalOpen(false);
    
    const handleGotoSignup = () => {
        setLoginModalOpen(false);
        setSignupModalOpen(true);
    };

    const handleGotoLogin = () => {
        setSignupModalOpen(false);
        setLoginModalOpen(true);
    };
    
    // Show loading screen only briefly while ethers loads
    if (!isEthersLoaded) {
        return (
            <div style={{ 
                padding: '50px', 
                textAlign: 'center', 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f9fdf9'
            }}>
                <div style={{ marginBottom: '20px', fontSize: '24px' }}>🌱</div>
                <p style={{ marginBottom: '10px' }}>Loading AyurChain...</p>
                <p style={{ color: '#6b7a6b', fontSize: '14px' }}>
                    Initializing blockchain dependencies
                </p>
                {loadingError && (
                    <p style={{ color: '#ef4444', marginTop: '10px', fontSize: '12px' }}>
                        {loadingError} - Starting in demo mode
                    </p>
                )}
            </div>
        );
    }


    return (
        <div className='app-container'>
            <Navbar navigate={navigate} openLogin={handleLoginOpen} />
            <div className="main-content">
                {CurrentPage ? <CurrentPage navigate={navigate} /> : <HomePage navigate={navigate} />}
            </div>
            
            <LoginModal 
                isOpen={loginModalOpen} 
                onClose={handleLoginClose} 
                onGotoSignup={handleGotoSignup} 
                navigate={navigate} 
            />
            
            <SignupModal 
                isOpen={signupModalOpen} 
                onClose={handleSignupClose} 
                onGotoLogin={handleGotoLogin}
            />

            {/* This is the combined CSS */}
            <style>{`
                :root {
                    --accent: #276b3b;
                    --muted: #6b7a6b;
                }
                body {
                    margin: 0;
                    font-family: 'Poppins', sans-serif;
                    background: #f9fdf9;
                    color: #183b2a;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
                body.loaded {
                    opacity: 1;
                    transform: translateY(0);
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html,body, #root, .app-container { height: 100%; }
                
                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--accent);
                    color: white;
                    padding: 16px 36px;
                    position: sticky;
                    top: 0;
                    z-index: 80;
                }
                .navbar .logo {
                    font-weight: 700;
                    font-size: 20px;
                }
                .navbar nav {
                    display: flex;
                    gap: 18px;
                }
                .navbar .nav-link {
                    color: white;
                    text-decoration: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    padding: 0;
                }
                .navbar .nav-link.icon { margin-left: 8px; padding: 6px; border-radius: 8px; }

                .login-floating {
                    position: absolute;
                    right: 36px;
                    top: 84px;
                    z-index: 85;
                }
                .login-btn {
                    background: linear-gradient(180deg, #2f8a48, #256936);
                    color: #fff;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-weight: 700;
                    text-decoration: none;
                    box-shadow: 0 8px 20px rgba(34,80,38,0.12);
                    display: inline-block;
                }

                .hero {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 64px 8%;
                    background: linear-gradient(120deg, rgba(240,255,244,0.9), rgba(233,252,233,0.9));
                }
                .hero-text { max-width: 60%; color: #0f2b1b; }
                .hero h1 {
                    font-size: 40px;
                    color: var(--accent);
                    margin-bottom: 10px;
                    line-height: 1.02;
                }
                .tagline {
                    font-style: italic;
                    color: var(--muted);
                    margin-bottom: 12px;
                }
                .lead {
                    color: #264e36;
                    margin-bottom: 18px;
                    font-size: 18px;
                }
                
                .buttons { display:flex; gap:12px; margin-top: 8px; }
                .btn {
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;
                    gap:8px;
                    padding: 12px 18px;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    border: none;
                }
                .btn.primary {
                    background: linear-gradient(180deg, var(--accent), #1f6a38);
                    color: white;
                    transition: transform 0.3s ease;
                }
                .btn.primary:hover { transform: translateY(-3px); }
                .btn.secondary {
                    background: #e6f4ea;
                    color: var(--accent);
                    border: 2px solid var(--accent);
                }

                .hero-image img {
                    width: 420px;
                    height: 260px; 
                    object-fit: cover;
                    border-radius: 14px;
                    box-shadow: 0 12px 30px rgba(6,20,8,0.12);
                }
                .features { text-align: center; padding: 56px 8%; background: white; }
                .features h2 { font-size: 30px; color: #225e33; margin-bottom: 28px; }
                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 22px;
                    max-width: 1180px;
                    margin: 0 auto;
                }
                .card {
                    background: #f5fdf7;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.06);
                    transition: transform .18s ease;
                }
                .card:hover { transform: translateY(-8px); }
                .card h3 { margin-bottom: 10px; color: var(--accent); }
                .card .feature-img { 
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    margin-top: 10px;
                    border-radius: 8px;
                }

                .cta {
                    text-align: center;
                    padding: 48px 8%;
                    background: linear-gradient(120deg, #e9fce9, #f0fff4);
                }
                .site-footer {
                    text-align: center;
                    padding: 14px;
                    background: var(--accent);
                    color: #fff;
                    margin-top: 18px;
                }

                .modal {
                    position: fixed;
                    inset: 0;
                    background: rgba(4,10,6,0.56);
                    z-index: 200;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-card {
                    background: #fff;
                    width: 360px;
                    max-width: calc(100% - 40px);
                    border-radius: 12px;
                    padding: 20px 22px;
                    position: relative;
                    box-shadow: 0 18px 50px rgba(2,8,4,0.38);
                }
                .modal-card h3 { color: var(--accent); margin-bottom: 12px; }
                .modal-card label { display:block; font-weight:600; margin-top:10px; color:#234d36; }
                .modal-card input {
                    width:100%;
                    padding:10px 12px;
                    border-radius:8px;
                    border:1px solid #e6efe6;
                    margin-top:8px;
                    background:#fcfffc;
                    color: #183b2a; 
                }
                .modal-card input::placeholder {
                    color: #6b7a6b;
                }
                .modal-card .modal-close {
                    position: absolute;
                    right: 12px;
                    top: 10px;
                    background: transparent;
                    border: none;
                    font-size:18px;
                    cursor:pointer;
                }
                .modal-note {
                    margin-top: 12px;
                    color: #356a45;
                }
                .inline-link {
                    background: none;
                    border: none;
                    color: var(--accent);
                    cursor: pointer;
                    font-weight: 600;
                    padding: 0;
                    margin-left: 5px;
                }

                /* Middleman/Analysis Page Layout */
                .container.middleman-page, .container.analysis-page {
                    background: #ffffff;
                    padding: 50px;
                    border-radius: 20px;
                    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
                    width: 650px; 
                    max-width: 95%;
                    text-align: center;
                    margin: 40px auto;
                    min-height: 50vh;
                }
                .middleman-page h2 {
                    font-size: 32px;
                    font-weight: 700;
                    color: #065f46;
                    margin-bottom: 25px;
                }

                .form-row {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .middleman-page input {
                    flex: 1;
                    padding: 14px;
                    border: 1px solid #a7f3d0;
                    border-radius: 10px;
                    background: #ecfdf5;
                    font-size: 15px;
                    transition: box-shadow 0.3s ease;
                    color: #183b2a; 
                }
                .middleman-page input::placeholder {
                    color: #6b7a6b;
                }
                .middleman-page input:focus {
                    outline: none;
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
                }
                .add-btn {
                    background-color: #10b981;
                    color: white;
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: 600;
                    transition: background 0.3s ease, transform 0.2s;
                }
                .add-btn:hover {
                    background-color: #059669;
                    transform: scale(1.03);
                }

                /* Data List */
                .data-list {
                    margin-top: 25px;
                    max-height: 250px;
                    overflow-y: auto;
                    text-align: left;
                }

                .data-item {
                    background: #ecfdf5;
                    padding: 14px;
                    border-radius: 10px;
                    margin-bottom: 12px;
                    font-size: 16px;
                    border-left: 4px solid #10b981;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .empty-msg, .loading-msg, .error-msg {
                    text-align: center;
                    padding: 15px;
                    color: #6b7a6b;
                }
                .error-msg {
                    color: #ef4444;
                    font-weight: 600;
                }

                /* Next Button */
                .btn-row {
                    margin-top: 25px;
                }

                .next-btn {
                    background-color: #047857;
                    color: white;
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: 600;
                    transition: background 0.3s ease, transform 0.2s;
                }
                .next-btn:hover {
                    background-color: #065f46;
                    transform: scale(1.03);
                }

                /* Quality Analysis Page Specific */
                .analysis-page .card {
                    background: white;
                    border-radius: 18px;
                    padding: 40px 50px;
                    width: 100%;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }
                
                .analysis-page .batch-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .analysis-page .batch-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #e8f5e9;
                    padding: 12px 15px;
                    border-radius: 10px;
                    font-size: 1rem;
                }

                .analysis-page .batch-item input[type="checkbox"] {
                    transform: scale(1.3);
                    cursor: pointer;
                }

                .submit-btn {
                    background-color: #047857;
                    color: white;
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: 600;
                    transition: background 0.3s ease, transform 0.2s;
                }
                .submit-btn:hover {
                    background-color: #065f46;
                    transform: scale(1.03);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .hero {
                        flex-direction: column;
                        text-align: center;
                        padding: 40px 4%;
                    }
                    .hero-text { max-width: 100%; margin-bottom: 20px; }
                    .hero-image img { width: 100%; max-width: 400px; }
                    .navbar { padding: 12px 20px; }
                    .navbar nav { gap: 12px; }
                    .features { padding: 40px 4%; }
                    .form-row { flex-direction: column; }
                    .container.middleman-page, .container.analysis-page {
                        padding: 30px 20px;
                        margin: 20px auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default App;

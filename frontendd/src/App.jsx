import React, { useState, useEffect, useCallback } from 'react';

// --- Assets and Configuration ---
// Placeholder URLs for images remain the same
const HERB_IMAGE = "https://placehold.co/420x260/e9fce9/0f2b1b?text=Ayur+Chain+Image";
const ASHWAGANDHA_IMAGE = "https://placehold.co/260x180/d9f1d9/0f2b1b?text=Ashwagandha";
const BRAHMI_IMAGE = "https://placehold.co/260x180/d9f1d9/0f2b1b?text=Brahmi+Leaves";
const TURMERIC_IMAGE = "https://placehold.co/260x180/d9f1d9/0f2b1b?text=Turmeric";

// --- Main App Component ---

const App = () => {
    const [page, setPage] = useState('home'); // home, customerPortal, companyLogin, companyRegister, companyPortal

    const navigate = (targetPage) => setPage(targetPage);

    const renderContent = () => {
        switch (page) {
            case 'customerPortal':
                return <CustomerPortal />;
            case 'companyLogin':
                return <CompanyLoginPage navigate={navigate} />;
            case 'companyRegister':
                return <CompanyRegisterPage navigate={navigate} />;
            case 'companyPortal':
                return <CompanyPortal />;
            case 'home':
            default:
                return <HomePage navigate={navigate} />;
        }
    };

    return (
        <div className="app-container">
            <Navbar navigate={navigate} />
            <main className="main-content">
                {renderContent()}
            </main>
            <Footer />
            <GlobalStyles />
        </div>
    );
};

// --- Layout Components ---

const Navbar = ({ navigate }) => (
    <header className="navbar">
        <div className="logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>🌱 AyurChain</div>
        <div className="user-toggle">
            <button className="toggle-btn" onClick={() => navigate('customerPortal')}>Customer Portal</button>
            <button className="toggle-btn" onClick={() => navigate('companyLogin')}>Company Login</button>
        </div>
    </header>
);

const Footer = () => (
    <footer className="site-footer">
        <p>© 2025 AyurChain. Ensuring Transparency in Ayurveda.</p>
    </footer>
);


// --- Page Components ---

const HomePage = ({ navigate }) => (
    <div className="home-page-container">
        <section className="hero" role="region" aria-label="Main hero">
            <div className="hero-text">
                <h1>From Farm to Formula 🌱</h1>
                <p className="tagline">"Knowing an herb's journey is the first step toward trusting what you take."</p>
                <p className="lead">Experience 100% transparency in Ayurvedic herbs — trace every step from the farmer's field to your medicine pack using Blockchain & QR codes.</p>
                <div className="buttons">
                    <button className="btn primary" onClick={() => navigate('customerPortal')}>🔎 Trace a Product</button>
                    <button className="btn secondary" onClick={() => navigate('companyLogin')}>🏢 Company Login</button>
                </div>
            </div>
            <div className="hero-image" aria-hidden="true">
                <img src={HERB_IMAGE} alt="Ayurvedic herbs" />
            </div>
        </section>
    </div>
);


const CustomerPortal = () => {
    const [scannedData, setScannedData] = useState(null);
    const [batchId, setBatchId] = useState('');
    const [fileName, setFileName] = useState('');

    const handleScan = () => {
        if (!batchId) {
            alert("Please enter a Batch ID or upload a QR code image to trace the product.");
            return;
        }
        setScannedData({
            id: batchId,
            name: "Ashwagandha Root Powder",
            collection: {
                location: "Neemuch, Madhya Pradesh",
                timestamp: "2024-09-15T08:30:00Z",
                collectorId: "FARM00123",
            },
            qualityTests: [
                { lab: "AyurLabs Pvt. Ltd.", test: "Pesticide Analysis", result: "Pass", timestamp: "2024-09-18T14:00:00Z", ipfsHash: "QmXoW8...a45B" },
                { lab: "GeoChem Labs", test: "DNA Barcoding", result: "Verified: Withania somnifera", timestamp: "2024-09-19T11:20:00Z", ipfsHash: "QmYv9N...c89F" }
            ],
            processing: [
                { step: "Drying", facility: "SunHarvest Co.", details: "Sun-dried for 72 hours", timestamp: "2024-09-20T10:00:00Z" },
                { step: "Grinding", facility: "SunHarvest Co.", details: "Cryogenic grinding to preserve nutrients", timestamp: "2024-09-23T16:00:00Z" }
            ],
            sustainability: {
                compliance: "NMPB Good Collection Practices Certified",
                fairTrade: "Verified Fair Trade Sourcing"
            }
        });
    };

    const handleQrUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setTimeout(() => {
                alert(`QR Code from "${file.name}" scanned successfully! Batch ID "ASHWA-001" found.`);
                setBatchId("ASHWA-001");
            }, 1000);
        }
    };

    return (
        <div className="customer-portal">
            <div className="scan-section">
                <h2>Trace Your Herb's Journey</h2>
                <p>Scan the QR code on your product to reveal its complete story from farm to you.</p>
                <div className="scan-input">
                    <input
                        type="text"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        placeholder="Enter Batch ID (e.g., ASHWA-001)"
                    />
                     <label className="qr-upload-label btn secondary">
                        📷 Upload QR
                        <input type="file" accept="image/*" onChange={handleQrUpload} style={{ display: 'none' }} />
                    </label>
                </div>
                {fileName && <p className="file-name-display">Selected file: {fileName}</p>}
                <button onClick={handleScan} className="btn primary trace-btn">Trace Product</button>
            </div>

            {scannedData && (
                <div className="provenance-details">
                    <h3>Provenance for Batch: {scannedData.id}</h3>
                    <h4>{scannedData.name}</h4>

                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-icon">🌱</div>
                            <div className="timeline-content">
                                <h5>Collection</h5>
                                <p><strong>Collector:</strong> {scannedData.collection.collectorId}</p>
                                <p><strong>Location:</strong> {scannedData.collection.location}</p>
                                <p><strong>Date:</strong> {new Date(scannedData.collection.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon">🔬</div>
                            <div className="timeline-content">
                                <h5>Quality Testing</h5>
                                {scannedData.qualityTests.map((test, index) => (
                                    <div key={index} className="test-result">
                                        <p><strong>{test.test}:</strong> {test.result} by {test.lab}</p>
                                        <a href={`#`} target="_blank" rel="noopener noreferrer">View Certificate (IPFS: {test.ipfsHash})</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon">⚙️</div>
                            <div className="timeline-content">
                                <h5>Processing</h5>
                                 {scannedData.processing.map((step, index) => (
                                    <p key={index}><strong>{step.step}:</strong> {step.details} at {step.facility}</p>
                                ))}
                            </div>
                        </div>
                         <div className="timeline-item">
                            <div className="timeline-icon">🌍</div>
                            <div className="timeline-content">
                                <h5>Sustainability</h5>
                                <p>{scannedData.sustainability.compliance}</p>
                                <p>{scannedData.sustainability.fairTrade}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Authentication Components ---

const generateCaptcha = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const CompanyLoginPage = ({ navigate }) => {
    const [captcha, setCaptcha] = useState('');
    
    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.captcha.value.toUpperCase() !== captcha) {
            alert('Invalid Captcha. Please try again.');
            setCaptcha(generateCaptcha());
            return;
        }
        // Demo credentials
        if (form.companyId.value === 'COMP123' && form.password.value === 'password') {
            alert('Login Successful!');
            navigate('companyPortal');
        } else {
            alert('Invalid Company ID or Password.');
            setCaptcha(generateCaptcha());
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleLogin} className="data-form auth-form">
                <h3>Company Login</h3>
                <label>Company ID</label>
                <input type="text" name="companyId" required defaultValue="COMP123" />
                <label>Password</label>
                <input type="password" name="password" required defaultValue="password" />
                <label>Captcha</label>
                <div className="captcha-box">
                    <span className="captcha-text">{captcha}</span>
                    <button type="button" onClick={() => setCaptcha(generateCaptcha())}>Regenerate</button>
                </div>
                <input type="text" name="captcha" placeholder="Enter captcha" required />
                <button type="submit" className="btn primary">Login</button>
                <p className="auth-switch">Don't have an account? <button type="button" onClick={() => navigate('companyRegister')}>Register here</button></p>
            </form>
        </div>
    );
};

const CompanyRegisterPage = ({ navigate }) => {
    const [captcha, setCaptcha] = useState('');
    
    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.captcha.value.toUpperCase() !== captcha) {
            alert('Invalid Captcha. Please try again.');
            setCaptcha(generateCaptcha());
            return;
        }
        alert(`Registration for "${form.name.value}" submitted successfully! You can now log in.`);
        navigate('companyLogin');
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleRegister} className="data-form auth-form">
                <h3>Company Registration</h3>
                <label>Company Name</label>
                <input type="text" name="name" required />
                <label>Company ID</label>
                <input type="text" name="companyId" required />
                <label>Password</label>
                <input type="password" name="password" required />
                <label>Location</label>
                <input type="text" name="location" required />
                <label>Registration Number</label>
                <input type="text" name="regNumber" required />
                <label>Captcha</label>
                 <div className="captcha-box">
                    <span className="captcha-text">{captcha}</span>
                    <button type="button" onClick={() => setCaptcha(generateCaptcha())}>Regenerate</button>
                </div>
                <input type="text" name="captcha" placeholder="Enter captcha" required />
                <button type="submit" className="btn primary">Register</button>
                <p className="auth-switch">Already have an account? <button type="button" onClick={() => navigate('companyLogin')}>Login here</button></p>
            </form>
        </div>
    );
};


// --- Company-Facing Components ---

const CompanyPortal = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="company-portal">
            <div className="company-nav">
                <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</button>
                <button onClick={() => setActiveTab('collection')} className={activeTab === 'collection' ? 'active' : ''}>Add Collection Event</button>
                <button onClick={() => setActiveTab('processing')} className={activeTab === 'processing' ? 'active' : ''}>Update Processing Step</button>
                <button onClick={() => setActiveTab('quality')} className={activeTab === 'quality' ? 'active' : ''}>Add Quality Test</button>
            </div>
            <div className="company-content">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'collection' && <CollectionForm />}
                {activeTab === 'processing' && <ProcessingForm />}
                {activeTab === 'quality' && <QualityForm />}
            </div>
        </div>
    );
};

const Dashboard = () => (
    <div className="dashboard">
        <h2>Supply Chain Overview</h2>
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Batches in Transit</h3>
                <p>42</p>
            </div>
            <div className="stat-card">
                <h3>Pending Quality Tests</h3>
                <p>8</p>
            </div>
            <div className="stat-card">
                <h3>Completed Products</h3>
                <p>1,250</p>
            </div>
        </div>
        <h4>Recent Activity</h4>
        <ul>
            <li>Batch ASHWA-002 completed quality testing.</li>
            <li>New collection event added by FARM007.</li>
            <li>Batch BRAHMI-011 moved to processing.</li>
        </ul>
    </div>
);

const CollectionForm = () => {
    const [formData, setFormData] = useState({
        collectorId: '',
        species: '',
        locationName: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`New Collection Event Submitted:\nCollector: ${formData.collectorId}\nSpecies: ${formData.species}\nLocation: ${formData.locationName}`);
        setFormData({ collectorId: '', species: '', locationName: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="data-form">
            <h3>Record New Collection Event</h3>
            <label>Collector ID</label>
            <input type="text" name="collectorId" value={formData.collectorId} onChange={handleChange} required />
            <label>Species</label>
            <input type="text" name="species" value={formData.species} onChange={handleChange} required />
            <label>Location Name (e.g., Neemuch, MP)</label>
            <input type="text" name="locationName" value={formData.locationName} onChange={handleChange} required />
            <button type="submit" className="btn primary">Submit Event</button>
        </form>
    );
};
const ProcessingForm = () => {
    const [formData, setFormData] = useState({
        batchId: '',
        step: '',
        facility: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
        const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Processing Step Added:\nBatch ID: ${formData.batchId}\nStep: ${formData.step}\nFacility: ${formData.facility}`);
        setFormData({ batchId: '', step: '', facility: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="data-form">
            <h3>Update Processing Step</h3>
            <label>Batch ID</label>
            <input type="text" name="batchId" value={formData.batchId} onChange={handleChange} required />
            <label>Processing Step (e.g., Drying, Grinding)</label>
            <input type="text" name="step" value={formData.step} onChange={handleChange} required />
            <label>Facility Name</label>
            <input type="text" name="facility" value={formData.facility} onChange={handleChange} required />
            <button type="submit" className="btn primary">Update Step</button>
        </form>
    );
};

const QualityForm = () => {
    const [formData, setFormData] = useState({
        batchId: '',
        testName: '',
        result: 'Pass'
    });
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setIpfsHash('');
        setUploadStatus('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a certificate PDF to upload.");
            return;
        }

        setUploadStatus(`Uploading "${file.name}" to IPFS...`);

        // Simulate IPFS upload delay and hash generation
        setTimeout(() => {
            const fakeHash = 'Qm' + Array(44).fill(0).map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
            setIpfsHash(fakeHash);
            setUploadStatus(`✅ Upload Complete!`);

            alert(`Quality Test Added:\nBatch ID: ${formData.batchId}\nTest: ${formData.testName}\nResult: ${formData.result}\nCertificate IPFS Hash: ${fakeHash}`);
            
            setFormData({ batchId: '', testName: '', result: 'Pass' });
            setFile(null);
            e.target.reset(); // Clear the file input
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="data-form">
            <h3>Add Quality Test Result</h3>
            <label>Batch ID</label>
            <input type="text" name="batchId" value={formData.batchId} onChange={handleChange} required />
            <label>Test Name</label>
            <input type="text" name="testName" value={formData.testName} onChange={handleChange} required />
            <label>Result</label>
            <select name="result" value={formData.result} onChange={handleChange}>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
            </select>
            <label>Upload Certificate (PDF)</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} required />
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
            {ipfsHash && <p className="ipfs-hash">IPFS Hash: {ipfsHash}</p>}
            <button type="submit" className="btn primary">Add Result</button>
        </form>
    );
};

// --- Global Styles ---

const GlobalStyles = () => (
    <style>{`
        :root {
            --primary-color: #2e7d32;
            --secondary-color: #66bb6a;
            --background-color: #f1f8e9;
            --text-color: #333;
            --light-gray: #f5f5f5;
        }
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
        }
        .app-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .main-content {
            flex-grow: 1;
            padding: 2rem;
        }
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .user-toggle {
            display: flex;
            gap: 1rem;
        }
        .toggle-btn {
            background-color: transparent;
            border: 1px solid transparent;
            color: white;
            padding: 0.5rem 1rem;
            cursor: pointer;
            border-radius: 20px;
            transition: background-color 0.3s, border-color 0.3s;
        }
        .toggle-btn:hover {
            border-color: var(--secondary-color);
        }
        .site-footer {
            text-align: center;
            padding: 1rem;
            background: var(--primary-color);
            color: white;
        }
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            text-align: center;
        }
        .btn.primary {
            background-color: var(--primary-color);
            color: white;
        }
         .btn.secondary {
            background-color: #e8f5e9;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }

        /* Home Page */
        .hero { display: flex; align-items: center; justify-content: space-between; padding: 4rem 8%; }
        .hero-text { max-width: 55%; }
        .hero h1 { font-size: 2.5rem; color: var(--primary-color); }
        .hero p { margin: 1rem 0; }
        .hero .buttons { display: flex; gap: 1rem; }
        .hero-image img { max-width: 400px; border-radius: 10px; }

        /* Customer Portal */
        .customer-portal { max-width: 900px; margin: auto; }
        .scan-section { background-color: white; padding: 2rem; border-radius: 10px; text-align: center; margin-bottom: 2rem; }
        .scan-input { display: flex; gap: 1rem; margin-top: 1rem; align-items: center; }
        .scan-input input { flex-grow: 1; padding: 0.75rem; border: 1px solid #ccc; border-radius: 5px; }
        .qr-upload-label { padding: 0.75rem; white-space: nowrap; }
        .file-name-display { font-size: 0.8rem; color: #555; margin-top: 0.5rem; }
        .trace-btn { margin-top: 1rem; width: 100%; }
        .provenance-details { background-color: white; padding: 2rem; border-radius: 10px; }
        .timeline { margin-top: 1.5rem; }
        .timeline-item { display: flex; align-items: flex-start; margin-bottom: 1.5rem; position: relative; padding-left: 50px; }
        .timeline-item::before { content: ''; position: absolute; left: 18px; top: 0; bottom: 0; width: 2px; background: #e0e0e0; }
        .timeline-item:last-child::before { display: none; }
        .timeline-icon { font-size: 1.5rem; position: absolute; left: 0; top: 0; width: 40px; height: 40px; background: var(--background-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #e0e0e0; }
        .timeline-content { padding-bottom: 1rem; }
        .timeline-content .test-result a { font-size: 0.9rem; color: var(--primary-color); display: block; margin-top: 4px; }

        /* Auth Pages */
        .auth-container { display: flex; justify-content: center; align-items: center; padding-top: 2rem; }
        .auth-form { max-width: 400px; width: 100%; }
        .captcha-box { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
        .captcha-text { user-select: none; background: #eee; padding: 0.5rem 1rem; border-radius: 5px; font-weight: bold; letter-spacing: 2px; }
        .captcha-box button { background: #ddd; border: 1px solid #ccc; padding: 0.5rem; border-radius: 5px; cursor: pointer; }
        .auth-switch { text-align: center; margin-top: 1rem; }
        .auth-switch button { background: none; border: none; color: var(--primary-color); text-decoration: underline; cursor: pointer; }

        /* Company Portal */
        .company-portal { max-width: 900px; margin: auto; }
        .company-nav { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .company-nav button { background-color: var(--light-gray); border: 1px solid #ccc; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; }
        .company-nav button.active { background-color: var(--primary-color); color: white; }
        .company-content { background-color: white; padding: 2rem; border-radius: 10px; }
        .dashboard .stats-grid { display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap; }
        .stat-card { background-color: var(--light-gray); padding: 1rem; border-radius: 5px; text-align: center; flex: 1; min-width: 150px; }
        .dashboard ul { list-style-type: none; padding-left: 0; }
        .dashboard li { background: #f9f9f9; padding: 0.75rem; border-radius: 5px; margin-bottom: 0.5rem; }
        .data-form { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .data-form label { display: block; margin-top: 1rem; text-align: left; font-weight: 600; }
        .data-form input, .data-form select { width: 100%; box-sizing: border-box; padding: 0.75rem; margin-top: 0.5rem; border: 1px solid #ccc; border-radius: 5px; }
        .data-form button { margin-top: 1.5rem; width: 100%; }
        .upload-status { margin-top: 0.75rem; font-style: italic; color: #555; }
        .ipfs-hash { margin-top: 0.5rem; font-weight: bold; color: var(--primary-color); word-break: break-all; }
        
        @media (max-width: 768px) {
            .hero { flex-direction: column-reverse; text-align: center; }
            .hero-text { max-width: 100%; }
            .navbar { flex-direction: column; gap: 1rem; }
        }
    `}</style>
);

export default App;
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { ref as dbRef, onValue, update } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaCheckCircle, FaClock, FaFileAlt, FaEye, FaCheck } from 'react-icons/fa';

const LawyerDashboard = () => {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchDocuments();
      } else {
        navigate('/lawyer-signin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchDocuments = () => {
    setLoading(true);
    const documentsRef = dbRef(db, 'documents');
    onValue(documentsRef, (snapshot) => {
      const docs = snapshot.val();
      const docsArray = docs ? Object.entries(docs).map(([id, data]) => ({ id, ...data })) : [];
      setDocuments(docsArray);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents. Please try again.");
      setLoading(false);
    });
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/lawyer-signin');
    }).catch((error) => {
      console.error('Sign out error', error);
    });
  };

  const handleApproveDocument = (docId) => {
    const docRef = dbRef(db, `documents/${docId}`);
    update(docRef, { status: 'approved' })
      .then(() => {
        console.log('Document approved successfully');
        // Update the local state to reflect the change
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === docId ? { ...doc, status: 'approved' } : doc
          )
        );
      })
      .catch((error) => {
        console.error('Error approving document:', error);
        setError("Failed to approve document. Please try again.");
      });
  };

  const handleViewPdf = async (pdfUrl) => {
    try {
      const url = await getDownloadURL(storageRef(storage, pdfUrl));
      setSelectedPdf(url);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      setError("Failed to load PDF. Please try again.");
    }
  };

  const renderDocumentList = () => {
    const filteredDocs = documents.filter(doc => 
      activeTab === 'pending' ? doc.status === 'pending' : doc.status === 'approved'
    );

    if (filteredDocs.length === 0) {
      return <p>No {activeTab} documents found.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <FaFileAlt className="text-blue-500 text-2xl" />
              <span className={`text-sm font-semibold ${doc.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleViewPdf(doc.pdfUrl)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
              >
                <FaEye className="mr-2" /> View PDF
              </button>
              {doc.status === 'pending' && (
                <button
                  onClick={() => handleApproveDocument(doc.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
                >
                  <FaCheck className="mr-2" /> Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">AequitasAI</h2>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`w-full flex items-center p-4 text-gray-700 ${activeTab === 'pending' ? 'bg-gray-200' : ''}`}
          >
            <FaClock className="mr-3" />
            Pending Documents
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`w-full flex items-center p-4 text-gray-700 ${activeTab === 'approved' ? 'bg-gray-200' : ''}`}
          >
            <FaCheckCircle className="mr-3" />
            Approved Documents
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeTab === 'approved' ? 'Approved Documents' : 'Pending Documents'}
            </h1>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-200">
                <FaCog className="text-gray-600" />
              </button>
              <button onClick={handleSignOut} className="ml-4 p-2 rounded-full hover:bg-gray-200">
                <FaSignOutAlt className="text-gray-600" />
              </button>
              <div className="ml-4 flex items-center">
                <FaUser className="text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{user?.displayName}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Document List */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderDocumentList()}
        </main>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">PDF Viewer</h2>
              <button onClick={() => setSelectedPdf(null)} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
            <iframe src={selectedPdf} className="w-full h-full" title="PDF Viewer"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDashboard;
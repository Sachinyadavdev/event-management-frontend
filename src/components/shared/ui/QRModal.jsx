/**
 * QRModal.jsx - Reusable QR Code Modal Component
 * 
 * Features:
 * - Generates scannable QR codes with customizable data
 * - Configurable styling and branding
 * - Download functionality with customizable formats
 * - Responsive design with dark mode support
 * - Extensible for different use cases (tickets, certificates, etc.)
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';

const QRModal = ({ 
  isOpen,
  onClose, 
  title = "Registration Successful!",
  subtitle = "Your ticket has been generated. Save this QR code for event check-in.",
  qrData,
  downloadConfig = {},
  customStyles = {},
  showDownload = true,
  showCloseButton = true,
  animations = true
}) => {
  const [qrCodeImage, setQrCodeImage] = useState('');

  // Default download configuration
  const defaultDownloadConfig = {
    filename: 'ticket',
    format: 'txt',
    contentGenerator: (data) => `
      ISACA Silicon Valley Event Ticket
      ================================
      Event: ${data.eventTitle || 'N/A'}
      Date: ${data.eventDate || 'N/A'}
      Attendee: ${data.attendeeName || 'N/A'}
      Email: ${data.attendeeEmail || 'N/A'}
      Registration ID: ${data.registrationId || 'N/A'}
    `,
    ...downloadConfig
  };

  // Generate QR code when modal opens or data changes
  useEffect(() => {
    if (isOpen && qrData) {
      generateQRCode();
    }
  }, [isOpen, qrData]);

  const generateQRCode = async () => {
    try {
      const qrString = typeof qrData === 'string' ? qrData : JSON.stringify(qrData);
      const qrImageUrl = await QRCode.toDataURL(qrString, {
        width: 200,
        margin: 2,
        color: {
          dark: customStyles.qrDark || '#000000',
          light: customStyles.qrLight || '#FFFFFF'
        },
        ...customStyles.qrOptions
      });
      setQrCodeImage(qrImageUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownload = () => {
    const content = defaultDownloadConfig.contentGenerator(qrData);
    const blob = new Blob([content], { 
      type: defaultDownloadConfig.format === 'pdf' ? 'application/pdf' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${defaultDownloadConfig.filename}.${defaultDownloadConfig.format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${animations ? 'animate-fade-in' : ''}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md relative shadow-2xl ${animations ? 'animate-scale-in' : ''}`}
        style={customStyles.modalContainer}
      >
        {/* Close X Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {subtitle}
          </p>
          
          {/* QR Code Container */}
          <div 
            className="w-52 h-52 bg-white border-4 border-gray-200 dark:border-gray-600 mx-auto mb-6 rounded-lg flex items-center justify-center p-3 shadow-lg"
            style={customStyles.qrContainer}
          >
            {qrCodeImage ? (
              <img 
                src={qrCodeImage} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-gray-500 animate-pulse">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H9V11M15,11H17V13H15V11M19,5H21V9H19V5M1,5H9V13H1V5M15,1H23V9H15V1M17,3H21V7H17V3M1,15H9V23H1V15M3,17H7V21H3V17Z" />
                </svg>
                <p className="text-sm">Generating QR Code...</p>
              </div>
            )}
          </div>
          
          {/* QR Code Info */}
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">QR Code Generated</p>
            {qrData?.registrationId && (
              <p className="text-xs text-gray-600 dark:text-gray-400">ID: {qrData.registrationId}</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            {showDownload && (
              <button
                onClick={handleDownload}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                style={customStyles.downloadButton}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Ticket
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600"
              style={customStyles.closeButton}
            >
              Close
            </button>
          </div>
          
          {/* Footer Text */}
          {qrData?.attendeeEmail && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              A confirmation email has been sent to {qrData.attendeeEmail}
            </p>
          )}
        </div>
      </div>
      
      {/* Add animations via style tag if needed */}
      {animations && (
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          
          .animate-scale-in {
            animation: scaleIn 0.3s ease-out;
          }
        `}</style>
      )}
    </div>
  );
};

QRModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  qrData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  downloadConfig: PropTypes.shape({
    filename: PropTypes.string,
    format: PropTypes.oneOf(['txt', 'pdf']),
    contentGenerator: PropTypes.func
  }),
  customStyles: PropTypes.shape({
    modalContainer: PropTypes.object,
    qrContainer: PropTypes.object,
    qrDark: PropTypes.string,
    qrLight: PropTypes.string,
    qrOptions: PropTypes.object,
    downloadButton: PropTypes.object,
    closeButton: PropTypes.object
  }),
  showDownload: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  animations: PropTypes.bool
};

export default QRModal;
// src/components/LeitorQrCode.jsx

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const LeitorQrCode = ({ onScanSuccess }) => {
  useEffect(() => {
    // Configurações do scanner
    const config = {
      fps: 10, // Frames por segundo
      qrbox: { width: 250, height: 250 }, // Tamanho da caixa de leitura
      rememberLastUsedCamera: true,
    };

    const qrCodeScanner = new Html5QrcodeScanner(
      "qr-reader", // ID do elemento div onde o scanner será renderizado
      config,
      /* verbose= */ false
    );

    // Renderiza o scanner e define o callback de sucesso
    qrCodeScanner.render(onScanSuccess, (error) => {
      // O callback de erro é chamado continuamente, ignore se não for útil
    });

    // Função de limpeza para parar o scanner quando o componente for desmontado
    return () => {
      qrCodeScanner.clear().catch(error => {
        console.error("Falha ao limpar o Html5QrcodeScanner.", error);
      });
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" style={{ width: '100%', maxWidth: '500px', border: 'transparent', borderRadius: '15px' }}></div>;
};

export default LeitorQrCode;
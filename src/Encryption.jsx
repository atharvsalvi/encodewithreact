import React, {useState, useRef, useEffect} from 'react';

function Encryption() {

    const encryptInputRef = useRef(null);
    const encryptKeyRef = useRef(null);
    const decryptInputRef = useRef(null);
    const decryptKeyRef = useRef(null);
    const displayText = useRef(null);

    const encryptSenderEmail = useRef(null);
    const encryptReceiverEmail = useRef(null);
    const decryptSenderEmail = useRef(null);
    const decryptReceiverEmail = useRef(null);

    const encyrptStorage = JSON.parse(localStorage.getItem('encyrptStorage')) || {
        inputText: '',
        inputKey: ''
    };

    const decyrptStorage = JSON.parse(localStorage.getItem('decyrptStorage')) || {
        inputText: '',
        inputKey: ''
    };

    useEffect(() => {
        encryptInputRef.current.value = encyrptStorage.inputText;
        encryptKeyRef.current.value = encyrptStorage.inputKey;
        decryptInputRef.current.value = decyrptStorage.inputText;
        decryptKeyRef.current.value = decyrptStorage.inputKey;
    }, []);

    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]|\:;\"'`<>,.?/ ";
    const [result, setResult] = useState('');

    function encrypt() {
        const text = encryptInputRef.current.value.trim().toLowerCase();
        const key = encryptKeyRef.current.value.trim().toLowerCase();

        if(text !== '' && key !== '') {
            displayText.current.style.display = 'block';
            setResult(vigenereCipher(text, key, 'encrypt'));
            const encyrptStorage = {inputText : text, inputKey : key};
            localStorage.setItem('encyrptStorage', JSON.stringify(encyrptStorage));
        }

    }

    function decrypt() {
        const text = decryptInputRef.current.value.trim().toLowerCase();
        const key = decryptKeyRef.current.value.trim().toLowerCase();

        if(text !== '' && key !== '') {
            displayText.current.style.display = 'block';
            setResult(vigenereCipher(text, key, 'decrypt'));
            const decyrptStorage = {inputText : text, inputKey : key};
            localStorage.setItem('decyrptStorage', JSON.stringify(decyrptStorage));
        }
        
    }

    function generateUniqueKey(type) {
        
        let sender, receiver;

        if(type === 'encrypt') {
            sender = encryptSenderEmail.current.value;
            receiver = encryptReceiverEmail.current.value;
        } else if(type === 'decrypt') {
            sender = decryptSenderEmail.current.value;
            receiver = decryptReceiverEmail.current.value;
        }
        
        const uniqueKey = vigenereCipher(sender, receiver, 'encrypt');

        if(type === 'encrypt') {
            encryptKeyRef.current.value = uniqueKey;
        } else if(type === 'decrypt') {
            decryptKeyRef.current.value = uniqueKey;
        }

    }

    function generateKey() {
        const keyLength = Math.floor( Math.random() * 5 + 6 );
        let key = '';

        for(let i=0; i<keyLength; i++) {
            key += alphabet.charAt( Math.floor( Math.random() * alphabet.length ) );
        }
        
        encryptKeyRef.current.value = key;
    }

    function vigenereCipher(text, key, op) {
        if(text !== '' && key !== '') {
            let processedText = "";
        let keyIndex = 0;

        const direction = ((op === 'encrypt')? 1 : -1);

        for(let i=0; i<text.length; i++) { 
            const charInText = text.charAt(i);
            const keyChar = (key.charAt(keyIndex%(key.length)));
            keyIndex++;
            const shift = alphabet.indexOf(keyChar);
            const code = alphabet.indexOf(charInText);
            const newIndex = (code + shift*(direction) + alphabet.length) % (alphabet.length);
            processedText += alphabet.charAt(newIndex); 
        }

        return processedText;
        }
        
    }

    return (
        <>
            <main className="grid">
                <div className="encrypt">
                    <div>Encryption</div>
                    <textarea ref={encryptInputRef} className="encrypt-input" placeholder="Enter your message"></textarea>
                    <div className='key-grid'>
                        <div className='key-section'>
                            <input ref={encryptKeyRef} className="input encrypt-key" placeholder="Enter your key"/>
                            <button className='generate-key-button' onClick={generateKey}>Generate Key</button>
                        </div>
                        <hr></hr>
                        <input ref={encryptSenderEmail} placeholder='Enter your Email-Id' className='input'/>
                        <input ref={encryptReceiverEmail} placeholder="Enter receiver's Email-Id" className='input'/>
                        <button className='encrypt-unique-key unique-key' onClick={() => generateUniqueKey('encrypt')}>Unique Key</button>
                    </div>
                    <button className="encrypt-button" onClick={encrypt}>Encrypt</button>
                </div>
                <div className="decrypt">
                    <div>Decryption</div>
                    <textarea ref={decryptInputRef} className="decrypt-input" placeholder="Enter your message"></textarea>
                    <div className='key-grid'>
                        <input ref={decryptKeyRef} className="input decrypt-key" placeholder="Enter your key"/>
                        <hr></hr>
                        <input ref={decryptReceiverEmail} placeholder='Enter your Email-Id' className='input'/>
                        <input ref={decryptSenderEmail} placeholder="Enter sender's Email-Id" className='input'/>
                        <button className='decrypt-unique-key unique-key' onClick={() => generateUniqueKey('decrypt')}>Unique Key</button>
                    </div>
                    
                    <button className="decrypt-button" onClick={decrypt}>Decrypt</button>
                </div>
            </main> 
            <div ref={displayText} className="display">
                <h4>Text</h4>
                <hr></hr>
                <p className="text">{result}</p>
            </div>
        </>
    );
}

export default Encryption;
// frontend/src/components/common/TextEditor.jsx

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic'; // <-- Critical for SSR control


// Dynamic imports ensure CKEditor only runs on the client side (browser)
const CKEditor = dynamic(
    () => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor),
    { ssr: false } // DO NOT render this component on the server
);

const Editor = dynamic(
    () => import('@ckeditor/ckeditor5-build-classic'),
    { ssr: false }
);

const TextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [Editor, setEditor] = useState(null);

    // Load the ClassicEditor class dynamically
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('@ckeditor/ckeditor5-build-classic')
                .then((mod) => setEditor(() => mod.default))
                .catch(err => console.error("CKEditor failed to load:", err));
        }
    }, []);

    if (!Editor) {
        return <div>Loading editor...</div>;
    }

    return (
        <div className="min-h-[300px] w-full">
            <CKEditor
                editor={Editor}
                data={value}
                config={{
                    placeholder: placeholder,
                    toolbar: [
                        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo'
                    ],
                }}
                onReady={(editor) => {
                    editorRef.current = editor;
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data); // Pass the HTML content back to the parent form
                }}
            />
        </div>
    );
};

export default TextEditor;
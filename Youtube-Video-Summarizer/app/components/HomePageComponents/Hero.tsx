'use client'
import { forwardRef, useEffect, useState } from "react"
import './test.css'

const Hero = forwardRef<HTMLDivElement>((props, ref) => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState();
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [pdfTheme, setPdfTheme] = useState('default');
  const [cachedPdfs, setCachedPdfs] = useState({
    default: null,
    dark: null,
  });

  async function handleSubmit(e:any) {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      body: JSON.stringify({
        videoUrl: JSON.stringify(url),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => setResponse(data.summary))
      .catch((error) => console.log(error));
  }

  async function generatePdf(response:any) {
    try {
      const res = await fetch('http://localhost:8000/generate-pdf', {
        method: 'POST',
        body: JSON.stringify({
          summary: response,
          theme: pdfTheme,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });
      
      const blob = await res.blob();
      const url:any = window.URL.createObjectURL(blob);

      setCachedPdfs((prev) => ({
        ...prev,
        [pdfTheme]: url,
      }));

      setPreviewPdfUrl(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }

  const handleThemeChange = (theme:string) => {
    setPdfTheme(theme);
    if (cachedPdfs[theme]) {
      setPreviewPdfUrl(cachedPdfs[theme]);
    } else if (response) {
      generatePdf(response);
    }
  };

  function handleDownload() {
    if (previewPdfUrl) {
      const a = document.createElement('a');
      a.href = previewPdfUrl;
      a.download = 'Summary.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  useEffect(() => {
    if (response && !cachedPdfs[pdfTheme]) {
      generatePdf(response);
    }
  }, [pdfTheme]);
    
    return (
        <>
          <div ref={ref} className="h-screen w100 bg-blue-700 mt-10">
            <p>Summarize</p>
            <form onSubmit={handleSubmit}>
              <input
          placeholder='Enter URL'
          type='text'
          id='url'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type='submit'><i className="fa-solid fa-paper-plane"></i> Summarize</button>
      </form>
      <div className='summary'>
        {response ||
          'The German Johannes Gutenberg introduced printing in Europe. His invention had a decisive contribution in spread of mass-learning and in building the basis of the modern society. Gutenberg major invention was a practical system permitting the mass production of printed books.'}
        {!previewPdfUrl && <button onClick={() => generatePdf(response)}>Generate Pdf</button>}
      </div>
      {previewPdfUrl && (
        <div className='preview'>
          <button onClick={() => handleThemeChange('default')}>Light Theme</button>
          <button onClick={() => handleThemeChange('dark')}>Dark Theme</button>
          {previewPdfUrl && <button onClick={() => handleDownload()}>Download</button>}
        </div>
      )}
      
      <div className='pdf-preview'>
        {previewPdfUrl && (
          <>
            <h3>PDF Preview</h3>
            <iframe
              src={previewPdfUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title='PDF Preview'
            />
          </>
        )}
      </div>
      </div>
        </>
    )
})

export default Hero
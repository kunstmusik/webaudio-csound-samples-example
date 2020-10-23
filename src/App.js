/* eslint-disable import/no-webpack-loader-syntax */
import React, { useEffect, useState } from "react";
import "./App.css";
import csd from "!raw-loader!!./sample_instrument.csd";
import CsoundObj from "@kunstmusik/csound";

async function loadResources(csound, filesArray, dirToSave) {
    for (let i = 0; i < filesArray.length; i++) {
        const fileUrl = filesArray[i];
        const serverUrl = `${process.env.PUBLIC_URL}/${fileUrl}`;
        //   console.log(serverUrl);
        const f = await fetch(serverUrl);
        const fName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        // const path = `/${dirToSave}/${fName}`;
        const path = `${fName}`;
        const buffer = await f.arrayBuffer();
        // console.log(path, buffer);
        await csound.writeToFS(path, buffer);
    }
    return true;
}

function App() {
    const [csound, setCsound] = useState(null);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (csound == null) {
            CsoundObj.initialize().then(() => {
                const cs = new CsoundObj();
                setCsound(cs);
            });
        }
    }, [csound]);

    const startCsound = async () => {
        csound.setOption("-+msg_color=false");

        const resources = [
            "SynthStrings1-WAV-20160913/SynthStrings1-30.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-36.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-42.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-48.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-54.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-60.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-66.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-72.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-78.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-84.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-90.wav",
            "SynthStrings1-WAV-20160913/SynthStrings1-96.wav",
        ];

        await loadResources(csound, resources, "SynthStrings1-WAV-20160913");

        csound.compileCSD(csd);
        csound.start();
        csound.audioContext.resume();
        setStarted(true);
    };
    return (
        <div className="App">
            <header className="App-header">
                <h1>Webaudio Csound Samples Example</h1>
                {csound ? (
                    started ? (
                        <div>Running...</div>
                    ) : (
                        <button onClick={startCsound}>Start Project</button>
                    )
                ) : (
                    <div>Loading...</div>
                )}
            </header>
        </div>
    );
}

export default App;

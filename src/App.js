/* eslint-disable import/no-webpack-loader-syntax */
import React, { useEffect, useState } from "react";
import "./App.css";
import csd from "!raw-loader!!./sample_instrument.csd";
import { Csound } from "@csound/browser";

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
        csound.fs.writeFileSync(path, new Uint8Array(buffer));
    }
    return true;
}

function App() {
    const [csound, setCsound] = useState(null);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (csound == null) {
            Csound().then(cs => {
                setCsound(cs);
            });	            
        }
    }, [csound]);

    const startCsound = async () => {
        await csound.setOption("-+msg_color=false");

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

        csound.compileCsdText(csd);
        csound.start();
        csound.getAudioContext().then(ctx => ctx.resume());
        setStarted(true);
    };
    return (
        <div className="App">
            <header className="App-header">
                <h1>Webaudio Csound Samples Example</h1>
                <div style={{width: "720px"}}>
                <p>Example that loads audio samples from server and runs with Webaudio Csound. 
                  Uses "Synth Strings #1" sample files from <a href="http://freepats.zenvoid.org/Synthesizer/synth-strings.html">FreePats</a>. View source on <a href="https://github.com/kunstmusik/webaudio-csound-samples-example">Github</a>.
                </p>
                {csound ? (
                    started ? (
                        <div>Running...</div>
                    ) : (
                        <button onClick={startCsound}>Start Project</button>
                    )
                ) : (
                    <div>Loading...</div>
                )}
                </div>
            </header>
        </div>
    );
}

export default App;

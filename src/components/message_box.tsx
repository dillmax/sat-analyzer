/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { BsFillPauseFill, BsPlayFill } from "react-icons/bs";
import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from "@tauri-apps/api/event";
import { FiSend, FiPlus, FiMinus } from "react-icons/fi";
import Slider from "@mui/material/Slider";

interface MenuProps {
  lines: string[];
}

function Menu({ lines }: MenuProps) {
  // Your component logic here

  const [inputValuePower, setInputValuePower] = useState("");
  function handleInputChangePower(event: any) {
    setInputValuePower(event.target.value);
  }

  const [inputValueStop, setInputValueStop] = useState("");
  function handleInputChangeStop(event: any) {
    setInputValueStop(event.target.value);
  }

  async function handleWriteCustom(str: string) {
    setInputValuePower("");
    setInputValueStop("");

    const newLines: any = [...lines, str];
    invoke("send_serial", { input: str });
  }

  const optionButtonContainerStyle = `h-[80px] lg:h-[20%] lgh:w-[90%] w-[90%] lg:w-[45%] rounded-lg gap-1 bg-gray-400 p-1 flex flex-row items-center justify-center`;
  const optionButtonStyle = `border border-gray-400 bg-gray-600 hover:bg-gray-400 hover:text-white text-gray-200 text-sm lg:text-base font-bold py-2 px-2 rounded-lg`;
  const singleButtonStyle = `h-[80px] lg:h-[20%] lgh:w-[90%] w-[90%] lg:w-[45%] border border-gray-400 bg-gray-600 hover:bg-gray-400 hover:text-white text-gray-200 text-sm lg:text-base font-bold py-2 px-2 rounded-lg`;

  const [slider1Value, setSlider1Value] = useState(0);
  const [slider2Value, setSlider2Value] = useState(0);

  const handleSlider1Change = (
    event: any,
    newValue: React.SetStateAction<number>
  ) => {
    setSlider1Value(newValue);
  };

  const handleSlider2Change = (
    event: any,
    newValue: React.SetStateAction<number>
  ) => {
    setSlider2Value(newValue);
  };

  console.log(slider1Value);
  console.log(slider2Value);

  return (
    <form>
      <div className="flex flex-col items-center w-3/6">
        <div className="w-full p-2 mb-2 text-xl text-center bg-gray-900 rounded-xl">
          Controller
        </div>
        <div className="flex flex-wrap items-center justify-center w-full h-full p-2 bg-gray-700 border-4 border-gray-600 overflow-fixed rounded-xl gap-x-6 gap-y-3">
          <div className={optionButtonContainerStyle}>
          {/* <div className={optionButtonContainerStyle}>
              <Slider
                value={slider1Value}
                onChange={handleSlider1Change}
                aria-label="X-Axis"
                valueLabelDisplay="auto"
                defaultValue={0}
                min={-90}
                max={90}
                step={1}
                marks
              />
            </div> */}
            <button
              onClick={() => handleWriteCustom(`SET PWOUT=${inputValuePower}`)}
              className={optionButtonStyle}
            >
              Moter B angle
            </button>
            <input
              id="myInput"
              type="text"
              className="w-[40%] h-1/2 text-sm text-black border-2 border-gray-700 p-2"
              value={inputValuePower}
              onChange={handleInputChangePower}
            />
          </div>
          <div className={optionButtonContainerStyle}>
            {/* <div className={optionButtonContainerStyle}>
              <Slider
                value={slider1Value}
                onChange={handleSlider1Change}
                aria-label="X-Axis"
                valueLabelDisplay="auto"
                defaultValue={0}
                min={-90}
                max={90}
                step={1}
                marks
              />
            </div> */}
            <button
              onClick={() => handleWriteCustom(`SET SSTOP=${inputValueStop}`)}
              className={optionButtonStyle}
            >
              Motar A Angle
            </button>
            <input
              id="myInput"
              type="text"
              className="w-[40%] h-1/2 text-sm text-black border-2 border-gray-700 p-2"
              value={inputValueStop}
              onChange={handleInputChangeStop}
            />
          </div>
          <button
            onClick={() => handleWriteCustom("SET PWOUT")}
            className={singleButtonStyle}
          >
            Set Power
          </button>
          <button
            onClick={() => handleWriteCustom("SET SSTOP")}
            className={singleButtonStyle}
          >
            Stop Status
          </button>
          <button
            onClick={() => handleWriteCustom("P")}
            className={singleButtonStyle}
          >
            Print Power
          </button>
        </div>
      </div>
    </form>
  );
}

interface BoxProps {
  lines: string[];
  setLines: React.Dispatch<React.SetStateAction<string[]>>;
}

// TODO turn off scroll ref if not at the bottom of the page
function Box({ lines, setLines }: BoxProps) {
  const [inputValueText, setInputValueText] = useState("");

  const handleInputChangeTextBox = (event: any) => {
    setInputValueText(event.target.value);
  };

  async function handleHello() {
    let data = await invoke("greet", { name: "World" });
    console.log(data);
    const newLines: any = [...lines, data];
    setLines(newLines);
  }

  async function handleSend(event: any) {
    event.preventDefault();
    // writeNewLines(inputValueText + "\n");
    setInputValueText("");
    // send serial
    await invoke("send_serial", { input: inputValueText });
  }

  const [isRecording, setIsRecording] = useState(true);

  function handleRecordToggle() {
    if (isRecording) {
      writeNewLines("\n(Serial console) Recording Started\n");
      setIsRecording(false);
    } else {
      writeNewLines("\n(Serial console) Recording Saved\n");
      setIsRecording(true);
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  // scroll to bottom
  function scrollToBottom() {
    if (scrollRef.current && isAtBottom) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  // TODO test this
  function handleIsAtBottom(e: React.UIEvent<HTMLDivElement>) {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    // Assuming setIsAtBottom is a state updater function
    setIsAtBottom(bottom);
  }

  const [messageBox, setMessageBox] = useState<String>("");

  function messages() {
    return (
      <div className="flex-1 p-4">
        {messageBox.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    );
  }

  // same as payload
  type Payload = {
    message: string;
  };

  async function startSerialEventListener() {
    await listen<Payload>("updateSerial", (event: any) => {
      writeNewLines(event.payload.message);
    });
  }

  // useEffect(() => {
  //   startSerialEventListener();
  // }, []);

  function writeNewLines(str: string) {
    setMessageBox((messageBox) =>
      // max 1,000,000 lines
      messageBox.concat(str).slice(-1000000)
    );
  }

  // check scroll to bottom on message update
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messageBox, messageBox.length]);

  return (
    <>
      <div className="flex flex-col w-full h-full overflow-hidden">
        {/* message box */}
        <div
          onScroll={handleIsAtBottom}
          ref={scrollRef}
          className="flex flex-col justify-start flex-grow h-full overflow-y-scroll resize-none bg-zinc-700"
        >
          {messages()}
        </div>
        {/* text box */}
        <form
          onSubmit={handleSend}
          className="flex flex-row items-center w-full"
        >
          {/* <MdUsb className="w-12 h-full p-2 bg-green-800 color-white" /> */}
          <input
            id="myInput"
            type="text"
            className="w-full p-2 text-black border-2 border-gray-400"
            value={inputValueText}
            onChange={handleInputChangeTextBox}
          />
          <FiSend
            onClick={handleSend}
            className="w-12 h-full p-2 text-white color-white bg-violet-800"
          />
        </form>
      </div>
    </>
  );
}

interface MessageBoxProps {
  isDropped: boolean;
}

export default function MessageBox({ isDropped }: MessageBoxProps) {
  const [lines, setLines] = useState<string[]>([]);

  return (
    /* main message box */
    <div className="flex flex-row w-full h-full gap-2 p-5 overflow-hidden bg-zinc-800">
      {/* buttons left*/}
      <Menu lines={lines} />
      {/* message box and text box right */}
      <Box lines={lines} setLines={setLines} />
    </div>
  );
}

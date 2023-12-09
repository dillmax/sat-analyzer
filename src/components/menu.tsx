/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { FaFile, FaCog, FaMinus, FaExpand, FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import {
  handleGetPorts,
  getBaudList,
  handleConnect,
  getEnding,
  handleRecord,
  handleSetFolder,
  sendError,
} from "../utils/serial";
import { emit, listen } from "@tauri-apps/api/event";

function MenuItem({ text, onClick }: any) {
  return (
    <li
      onClick={onClick}
      className="px-6 py-2 text-black bg-white cursor-pointer hover:bg-zinc-400"
    >
      {text}
    </li>
  );
}

function SubMenu({ text, setHook, menuItemList }: any) {
  const [isSubOpen, setIsSubOpen] = useState(false);

  const openDropdown = () => {
    setIsSubOpen(true);
  };

  const closeDropdown = () => {
    setIsSubOpen(false);
  };

  function handleSelection(item: string) {
    setHook(item);
  }

  return (
    <li
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
    >
      <li className="px-6 py-2 text-black bg-white cursor-pointer hover:bg-zinc-400">
        {text}
      </li>
      {isSubOpen && (
        <ul className="absolute top-0 bg-white w-max left-full">
          {menuItemList.map((item: any, index: any) => (
            <MenuItem
              key={index}
              text={item}
              onClick={() => handleSelection(item)}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function Serial() {
  const [baud, setBaud] = useState("9600");
  const [port, setPort] = useState("None");
  const [portList, setPortList] = useState(["None"]);
  const [ending, setEnding] = useState("None");
  const [isConnected, setIsConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // open dropdown and also gets dynamic data
  function openDropdown() {
    setIsDropdownOpen(true);
    handleGetPorts(setPortList);
  }

  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  // same as payload
  type Payload = {
    connected: string;
  };

  async function startSerialEventListenerOnIsConnection() {
    await listen<Payload>("isConnected", (event: any) => {
      console.log(event.payload.message);
      if (event.payload.message === "disconnected") {
        setIsConnected(false);
      }
      sendError("Port has been unexpectedly disconected");
    });
  }

  useEffect(() => {
    startSerialEventListenerOnIsConnection();
  }, []);

  return (
    <nav onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
      <ul className="flex items-center justify-center py-2 cursor-pointer">
        <li className="relative px-4 h-fit">
          <span>Com_Port</span>
          {isDropdownOpen && (
            <ul className="absolute left-0 flex-col block my-1 bg-white w-max">
              <MenuItem
                text={isConnected ? "Disconnect" : "Connect"}
                onClick={() =>
                  handleConnect(port, baud, ending, setIsConnected)
                }
              />
              <SubMenu
                text={`Baud: ${baud}`}
                setHook={setBaud}
                menuItemList={getBaudList()}
              />
              <SubMenu
                text={`Port: ${port}`}
                setHook={setPort}
                menuItemList={portList}
              />
              <SubMenu
                text={`Prifix: ${ending}`}
                setHook={setEnding}
                menuItemList={getEnding()}
              />
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

function Record() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // same as payload
  type Payload = {
    connected: string;
  };
  async function startSerialEventListenerOnIsRecording() {
    await listen<Payload>("isRecording", (event: any) => {
      console.log(event.payload.message);
      if (event.payload.message === "not recording") {
        setIsRecording(false);
      }
    });
  }

  useEffect(() => {
    startSerialEventListenerOnIsRecording();
  }, []);

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
      <ul className="flex items-center justify-center py-2 cursor-pointer">
        <li className="relative px-5 h-fit">
          <span>Export_Val</span>
          {isDropdownOpen && (
            <ul className="absolute left-0 flex flex-col my-1 bg-white w-max">
              <MenuItem
                text={isRecording ? "Stop" : "Start"}
                onClick={() => handleRecord(setIsRecording)}
              />
              <MenuItem text="Set Location" onClick={() => handleSetFolder()} />
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default function WindowBar() {
  // TODO move function to backend
  async function closeWindow() {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.close();
  }

  async function toggleMaximize() {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.toggleMaximize();
  }

  async function toggleMinimize() {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.minimize();
  }

  return (
    <div
      data-tauri-drag-region
      className="relative flex items-center justify-between h-8 text-white bg-zinc-900"
    >
      <div className="flex menu-options">
        <Record />
        <Serial />
      </div>
      <div className="absolute inset-y-0 flex items-center space-x-2 transform -translate-x-1/2 cursor-default left-1/2">
        <p>Solar_Panel_Analyer</p>
      </div>
      <div className="flex gap-2 px-4 space-x-2">
        <button
          onClick={toggleMinimize}
          className="flex items-center justify-center"
        >
          <FaMinus className="w-3 h-3 text-white" />
        </button>
        <button
          onClick={toggleMaximize}
          className="flex items-center justify-center"
        >
          <FaExpand className="w-3 h-3 text-white" />
        </button>
        <button
          onClick={closeWindow}
          className="flex items-center justify-center"
        >
          <FaTimes className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

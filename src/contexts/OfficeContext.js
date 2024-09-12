import { createContext, useState, useContext } from 'react';

const OfficeContext = createContext();

export const useOfficeContext = () => useContext(OfficeContext);

export const OfficeProvider = ({ children }) => {
  const [office, setOffice] = useState([]);
  const [whiteboard, setWhiteboard] = useState([]);
  const [readyForQuery, setReadyForQuery] = useState(false);

  const addOfficeInfo = (officeDetails) => {
    setOffice(officeDetails);
  };

  const addWhiteboardInfo = (whiteboardDetails) => {
    setWhiteboard(whiteboardDetails);
  };

  return (
    <OfficeContext.Provider
      value={{
        office,
        whiteboard,
        addOfficeInfo,
        addWhiteboardInfo,
        readyForQuery,
        setReadyForQuery,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
};

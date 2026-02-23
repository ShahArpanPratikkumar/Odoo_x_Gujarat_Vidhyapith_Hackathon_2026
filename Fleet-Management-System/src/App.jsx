import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { FleetProvider } from "./context/FleetContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FleetProvider>
          <BrowserRouter>
            <RoutesConfig />
          </BrowserRouter>
        </FleetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

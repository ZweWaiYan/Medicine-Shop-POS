import Register from "./Login/Register";
import Sale from "./Sale/Sale"
import Login from "./Login/Login"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
          <Sale/>
    </QueryClientProvider>    

    // <Login />
  )
}

export default App

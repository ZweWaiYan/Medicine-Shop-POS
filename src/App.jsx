import Sale from "./Sale/Sale"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {  

  return (
    <QueryClientProvider client={queryClient}>
          <Sale/>
    </QueryClientProvider>

  )
}

export default App

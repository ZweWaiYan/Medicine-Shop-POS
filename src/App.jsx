import Register from "./Login/Register";
import Sale from "./Sale/Sale"
import Login from "./Login/Login"
import Bill from "./Bill/Bill"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BillReport from "./Sale/BillReport";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
              {/* <Bill />     */}
                   {/* <Sale/>    */}
                   <BillReport/>
     </QueryClientProvider>        

  )
}

export default App

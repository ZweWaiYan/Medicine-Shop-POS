import Register from "./Login/Register";
import Login from "./Login/Login"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ItemList from "./Item/ItemList";
import BillList from "./Bill/BillList"
import BillReport from "./Bill/BillReport/BillReport";


const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
              {/* <BillList />     */}
                  {  <ItemList/> }
                   {/*<BillReport/>*/}
     </QueryClientProvider>        

  )
}

export default App
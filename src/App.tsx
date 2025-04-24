
import { Toaster } from "react-hot-toast";
import RouterIndex from "./routers/RoutersIndex";
import { Provider } from "react-redux";
import { store } from "./redux/stores/store";
import ReactQueryProvider from "./providers/ReactQueryProvider";

function App() {
  return (
    <ReactQueryProvider>
      <Provider store={store}>
        <RouterIndex />
        <Toaster />
      </Provider>
    </ReactQueryProvider>
  )
}
export default App

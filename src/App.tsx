
import { Toaster } from "react-hot-toast";
import RouterIndex from "./routers/RoutersIndex";
import { Provider } from "react-redux";
import { store } from "./redux/stores/store";

function App() {
  return (
    <Provider store={store}>
      <RouterIndex />
      <Toaster />
    </Provider>

  )
}
export default App

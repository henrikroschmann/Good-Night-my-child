import "./App.css";
import StoryGenerator from "./components/StoryGenerator";
import StoryReader from "./components/StoryReader";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Good Night my child</h1>
      </header>
      <main>
        <StoryGenerator />
        <StoryReader />
      </main>
    </div>
  );
}

export default App;

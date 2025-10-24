import { useState } from "react";
import { useLocation } from "react-router-dom";
//import { Toaster } from "sonner"; 
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Toaster } from "sonner";
import { SortableItem } from "./Components/SortableItem";
import appCSS from "./App.module.css";
import Navigation from "./Components/Navigation/Navigation";
import Router from "./routes/Routes";
import Login from "./Components/Login/Login";
import Explore from "./page/ExplorePage/Explore";


function App() {
  const [showSecond, setShowSecond] = useState(false);
  const [isGuest, setGuest] = useState(false);
  const location = useLocation(); // 👈 lấy đường dẫn hiện tại

  const [items, setItems] = useState(["page", "explore"]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Nếu đang ở /signin thì chỉ render SignIn
  if (location.pathname === "/signin") {
    return (
      <div className={appCSS["signin-page"]}>
        <Router />
      </div>
    ); 
  }

  //Nếu đang ở /signup thì chỉ render Signup
  if (location.pathname === "/signup") {
    return (
      <div className={appCSS["signup-page"]}>
        <Router />
      </div>
    );
  }

  return (
    <div className={appCSS["layout-web"]}>
      <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  success: "toast-success",
                  error: "toast-error",
                  warning: "toast-warning",
                },
              }}
            />
      <div className={appCSS["nav"]}>
        <Navigation showPage={() => setShowSecond(!showSecond)} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <div
            className={`${appCSS["pages-container"]} ${
              showSecond ? appCSS["two"] : appCSS["one"]
            }`}
          >
            {items.map((id) =>
              id === "page" ? (
                <SortableItem key="page" id="page">
                  <div className={appCSS["page-render"]}>
                    <Router />
                  </div>
                </SortableItem>
              ) : (
                showSecond && (
                  <SortableItem key="explore" id="explore">
                    <div className={appCSS["box-explore"]}>
                      <Explore />
                    </div>
                  </SortableItem>
                )
              )
            )}
            {!isGuest && <Login guest={setGuest} />}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default App;

// import { useState } from "react";
// import {
//   DndContext, 
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';

// import {SortableItem} from './SortableItem';
// import appCSS from "./App.module.css";
// import Navigation from "./Components/Navigation/Navigation";
// import Router from "./routes/Routes";
// import Login from "./Components/Login/Login";
// import Explore from "./page/ExplorePage/Explore";

// function App() {
//   const [showSecond, setShowSecond] = useState(false);
//   const [isGuest, setGuest]= useState(false);
//   const [items, setItems] = useState([1, 2, 3]);
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   return (
//     <>
//       <div className={appCSS["layout-web"]}>
//         {/* Cột điều hướng */}
//         <div className={appCSS["nav"]}>
//           <Navigation showPage={()=>setShowSecond(!showSecond)}/>
            
//         </div>

//         {/* Container các page */}
        
//         <div
//           className={`${appCSS["pages-container"]} ${
//             showSecond ? appCSS["two"] : appCSS["one"]
//           }`}
//         >
          
//           {/* Page Render 1 */}
//           <div className={appCSS["page-render"]}>
//               <Router />
//           </div>
          
//           {/* Explore */}
//           {showSecond && (
//             <div className={appCSS["box-explore"]}>
//               <Explore />
//             </div>
//           )}
//           {!isGuest && <Login guest={setGuest}/>}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import { useState } from "react";
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

import { SortableItem } from "./Components/SortableItem";
import appCSS from "./App.module.css";
import Navigation from "./Components/Navigation/Navigation";
import Router from "./routes/Routes";
import Login from "./Components/Login/Login";
import Explore from "./page/ExplorePage/Explore";

function App() {
  const [showSecond, setShowSecond] = useState(false); 
  const [isGuest, setGuest] = useState(false);

  // items: danh sách ID của các box
  const [items, setItems] = useState(["page", "explore"]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  return (
    <div className={appCSS["layout-web"]}>
      {/* Cột điều hướng */}
      <div className={appCSS["nav"]}>
        <Navigation showPage={() => setShowSecond(!showSecond)} />
      </div>

      {/* Container các page */}
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


// import { useRef } from "react";
// import { useVirtualizer } from "@tanstack/react-virtual";

// function VirtualizedTable({
//   columns = [],
//   data = [],
//   getRowKey,
//   rowHeight = 48,
//   maxHeight = 288,
//   emptyMessage = "No records found.",
// }) {
//   const parentRef = useRef(null);

//   const gridTemplateColumns = columns
//     .map((column) => column.width || "minmax(120px, 1fr)")
//     .join(" ");

//   const virtualizer = useVirtualizer({
//     count: data.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => rowHeight,
//     overscan: 5,
//     getItemKey: (index) =>
//       getRowKey?.(data[index], index) ?? index,
//   });

//   const virtualItems = virtualizer.getVirtualItems();

//   return (
//     <div className="virtual-table-wrapper">
//       {data.length === 0 ? (
//         <div className="empty-state">{emptyMessage}</div>
//       ) : (
//         <>
//           <div
//             ref={parentRef}
//             className="virtual-table-scroll"
//             style={{ maxHeight, overflowY: "auto", overflowX: "auto" }}
//           >
//             <div
//               className="virtual-table-inner"
//               style={{ minWidth: "max-content" }}
//             >
//               {/* Table Header */}
//               <div
//                 className="virtual-table-header"
//                 style={{ gridTemplateColumns }}
//               >
//                 {columns.map((column) => (
//                   <div
//                     className="virtual-table-heading"
//                     key={column.key}
//                   >
//                     {column.header}
//                   </div>
//                 ))}
//               </div>

//               {/* Virtualized Rows */}
//               <div
//                 className="virtual-table-body"
//                 style={{
//                   height: virtualizer.getTotalSize(),
//                   position: "relative",
//                 }}
//               >
//                 {virtualItems.map((item) => {
//                   const firstIndex = item.index;
//                   const lastIndex = firstIndex + 1;

//                   const visibleData = data.slice(
//                     firstIndex,
//                     lastIndex
//                   );

//                   const record = visibleData[0];

//                   return (
//                     <div
//                       key={item.key}
//                       className="virtual-table-row"
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns,
//                         height: item.size,
//                         transform: `translateY(${item.start}px)`,
//                       }}
//                     >
//                       {columns.map((column) => (
//                         <div
//                           className="virtual-table-cell"
//                           key={column.key}
//                         >
//                           {column.render(record, firstIndex)}
//                         </div>
//                       ))}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="virtual-table-footer">
//             Total records: {data.length}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default VirtualizedTable;

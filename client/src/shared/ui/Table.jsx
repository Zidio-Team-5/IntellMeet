/**
 * Compound table primitive for dense, enterprise-style data lists.
 *
 *   <Table>
 *     <Table.Head>
 *       <Table.Row>
 *         <Table.HeadCell>Name</Table.HeadCell>
 *         <Table.HeadCell align="right">Duration</Table.HeadCell>
 *       </Table.Row>
 *     </Table.Head>
 *     <Table.Body>
 *       <Table.Row onClick={...}>
 *         <Table.Cell>…</Table.Cell>
 *         <Table.Cell align="right" numeric>45m</Table.Cell>
 *       </Table.Row>
 *     </Table.Body>
 *   </Table>
 */

const alignCls = (align) =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

export default function Table({ children, className = "" }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--border)]">
      <div className="overflow-x-auto">
        <table
          className={`w-full border-collapse text-sm ${className}`}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

function Head({ children, sticky = false, className = "" }) {
  return (
    <thead
      className={`bg-[var(--bg-surface)] ${sticky ? "sticky top-0 z-10" : ""} ${className}`}
    >
      {children}
    </thead>
  );
}

function Body({ children, className = "" }) {
  return <tbody className={className}>{children}</tbody>;
}

function Row({ children, onClick, selected = false, className = "" }) {
  const interactive = onClick
    ? "cursor-pointer hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:bg-[var(--bg-hover)]"
    : "";
  return (
    <tr
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={`border-b border-[var(--border-subtle)] transition-colors duration-150 last:border-0 ${
        selected ? "bg-[var(--bg-active)]" : ""
      } ${interactive} ${className}`}
    >
      {children}
    </tr>
  );
}

function HeadCell({ children, align = "left", className = "", ...props }) {
  return (
    <th
      scope="col"
      className={`border-b border-[var(--border)] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] ${alignCls(
        align
      )} ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

function Cell({ children, align = "left", numeric = false, className = "", ...props }) {
  return (
    <td
      className={`px-4 py-3 align-middle text-[var(--text)] ${alignCls(align)} ${
        numeric ? "tabular-nums" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.HeadCell = HeadCell;
Table.Cell = Cell;
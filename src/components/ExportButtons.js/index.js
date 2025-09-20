// src/components/ExportButtons.js
"use client";
import Image from "next/image";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportButtons({ products }) {
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
    XLSX.writeFile(workbook, "Relatorio_Produtos.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text("Relatório de Produtos", 14, 16);

    const head = [
      ["ID (EAN)", "Nome do Produto", "Qtd.", "Preço", "Validade", "Seção"],
    ];

    const body = products.map((p) => [
      p.id,
      p.nome_produto,
      p.quantidade,
      `R$ ${Number(p.preco).toFixed(2)}`,
      p.validade
        ? new Date(p.validade).toLocaleDateString("pt-BR", { timeZone: "UTC" })
        : "N/A",
      p.secao || "N/A", // Adicionando a seção
    ]);

    // Agora, com o plugin importado, a função .autoTable() existirá
    autoTable(doc, {
      head: head,
      body: body,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("Relatorio_Produtos.pdf");
  };

  return (
    <div className="flex justify-between md:justify-start  md:gap-4 items-center mb-4">
      <Image
        src="/profile.png"
        alt="Picture of the author"
        width={40}
        height={30}
        className="rounded-full"
      />
      <div className="flex gap-x-2">
        <button
          onClick={handleExportXLSX}
          disabled={!products || products.length === 0}
          className="px-3 py-2 text-sm font-semibold bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Baixar XLSX
        </button>
        <button
          onClick={handleExportPDF}
          disabled={!products || products.length === 0}
          className="px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Baixar PDF
        </button>
      </div>
    </div>
  );
}

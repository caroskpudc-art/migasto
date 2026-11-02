import React, { useState, useEffect } from "react";

export default function MiEssentialApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [budgets, setBudgets] = useState({
    totalMonthly: 750,
    categories: {
      "Supermercado & Alimentación": 250,
      "Ocio & Restaurantes": 200,
      "Hogar & Suministros": 150,
      "Suscripciones & Apps": 100,
      "Otros": 50
    }
  });

  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: "Colchón de seguridad", target: 2000, current: 1200 },
    { id: 2, name: "Viaje / Vacaciones", target: 800, current: 450 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, merchant: "Planeta Huerto", amount: 14.50, category: "Supermercado & Alimentación", date: "Hoy, 10:30", type: "apple-pay", unnecessary: false },
    { id: 2, merchant: "Spotify", amount: 10.99, category: "Suscripciones & Apps", date: "Ayer", type: "apple-pay", unnecessary: true },
    { id: 3, merchant: "Cafetería Local", amount: 3.80, category: "Ocio & Restaurantes", date: "Hace 2 días", type: "apple-pay", unnecessary: true },
    { id: 4, merchant: "Supermercado", amount: 45.20, category: "Supermercado & Alimentación", date: "Hace 3 días", type: "apple-pay", unnecessary: false }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "¡Hola! Soy tu asistente financiero de MiEssential. ¿Cómo vas este mes o en qué te puedo ayudar?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [simulatedMerchant, setSimulatedMerchant] = useState("");
  const [simulatedAmount, setSimulatedAmount] = useState("");

  // Cálculos financieros
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalSavings = savingsGoals.reduce((acc, g) => acc + g.current, 0);
  
  // Exceso sobre el presupuesto base (750€)
  const budgetLimit = budgets.totalMonthly;
  const excess = totalSpent > budgetLimit ? totalSpent - budgetLimit : 0;
  
  // Total Disponible = Presupuesto - Gastos
  const totalAvailable = budgetLimit - totalSpent;
  
  // Total Ahorrado Real = Ahorros acumulados - Exceso de gastos si nos pasamos
  const effectiveSavings = Math.max(0, totalSavings - excess);
  
  // Total Ahorrado este mes (ejemplo simulado de aportaciones este mes)
  const totalSavedThisMonth = 150;

  // Simular pago con Apple Pay
  const handleSimulateApplePay = (e) => {
    e.preventDefault();
    if (!simulatedMerchant || !simulatedAmount) return;

    const amountNum = parseFloat(simulatedAmount);
    const newTx = {
      id: Date.now(),
      merchant: simulatedMerchant,
      amount: amountNum,
      category: "Otros",
      date: "Justo ahora",
      type: "apple-pay",
      unnecessary: amountNum < 20 // Criterio simple de IA simulada
    };

    setTransactions([newTx, ...transactions]);
    setSimulatedMerchant("");
    setSimulatedAmount("");
  };

  // Enviar mensaje al chat de IA
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInputMessage("");

    setTimeout(() => {
      let reply = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("como voy") || lower.includes("mes") || lower.includes("gastos")) {
        reply = `Llevas gastados ${totalSpent.toFixed(2)}€ de tu presupuesto de ${budgetLimit}€. Tu total disponible es de ${totalAvailable.toFixed(2)}€. ${excess > 0 ? `⚠️ Te has pasado del presupuesto por ${excess.toFixed(2)}€, lo cual se ha descontado de tus ahorros.` : "¡Vas muy bien este mes!"}`;
      } else if (lower.includes("ahorro") || lower.includes("ahorrado")) {
        reply = `Tienes un total ahorrado efectivo de ${effectiveSavings.toFixed(2)}€ (este mes has apartado ${totalSavedThisMonth}€).`;
      } else {
        reply = `Entendido. He analizado tu petición sobre "${userMsg}". Tus finanzas están sincronizadas con Apple Pay y los presupuestos están activos.`;
      }
      setChatMessages((prev

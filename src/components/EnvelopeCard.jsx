import { calcSinkingFund } from "../calcSinkingFund"
import { useState } from "react"
export default function EnvelopeCard({ envelope, onOpenModal, onSelect }) {
    const { id, name, balance, color, targetAmount, dueDate } = envelope
    const isNegative = balance < 0
    const fund = calcSinkingFund(balance, targetAmount, dueDate)

    return (
        <div
            onClick={() => onSelect(envelope)}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow"
        >
            {/* SVG flap — no overflow issues */}
            <svg
                viewBox="0 0 360 80"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full block"
                style={{ height: '72px' }}
            >
                <rect width="360" height="80" fill={color} />
                <polygon points="0,0 360,0 180,52" fill="rgba(0,0,0,0.10)" />
                <text
                    x="16" y="22"
                    fontSize="13"
                    fontWeight="500"
                    fill="rgba(255,255,255,0.95)"
                    fontFamily="sans-serif"
                >
                    {name}
                </text>
                <circle cx="344" cy="16" r="5" fill="rgba(255,255,255,0.4)" />
            </svg>

            {/* Card body */}
            <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Available</p>
                        <p className={`text-2xl font-semibold ${isNegative ? 'text-red-700' : 'text-gray-900'}`}>
                            ${balance.toFixed(2)}
                        </p>
                    </div>
                    {fund?.funded && (
                        <span className="text-xs bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full">
                            Funded ✓
                        </span>
                    )}
                    {fund && !fund.funded && !fund.overdue && (
                        <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full">
                            Save ${fund.perMonth}/mo
                        </span>
                    )}
                    {fund?.overdue && (
                        <span className="text-xs bg-red-100 text-red-800 font-medium px-2 py-1 rounded-full">
                            Overdrawn
                        </span>
                    )}
                </div>

                {/* Progress bar */}
                {fund && !fund.funded && !fund.overdue && (
                    <>
                        <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                            <div
                                className="h-1 rounded-full transition-all"
                                style={{
                                    width: `${Math.min((balance / targetAmount) * 100, 100)}%`,
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 -mt-1">
                            <span>${balance.toFixed(2)} of ${targetAmount.toFixed(2)}</span>
                            <span>{fund.daysLeft} days left</span>
                        </div>
                    </>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'income', envelopeId: id }) }}
                        className="bg-green-50 text-green-800 text-xs font-medium py-2 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        + Income
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'expense', envelopeId: id }) }}
                        className="bg-red-50 text-red-800 text-xs font-medium py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        − Expense
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'transfer', envelopeId: id }) }}
                        className="bg-blue-50 text-blue-800 text-xs font-medium py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        ⇄ Transfer
                    </button>
                </div>
            </div>
        </div>
    )
}
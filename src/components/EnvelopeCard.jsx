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
            {/* SVG flap */}
            <svg
                viewBox="0 0 180 64"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full block"
                style={{ height: '56px', pointerEvents: 'none' }}
            >
                <rect width="180" height="64" fill={color} />
                <polygon points="0,0 180,0 90,42" fill="rgba(0,0,0,0.10)" />
                <text
                    x="10" y="18"
                    fontSize="11"
                    fontWeight="500"
                    fill="rgba(255,255,255,0.95)"
                    fontFamily="sans-serif"
                >
                    {name}
                </text>
                <circle cx="170" cy="12" r="4" fill="rgba(255,255,255,0.4)" />
            </svg>

            {/* Body */}
            <div className="px-3 pt-2 pb-3 flex flex-col gap-2">
                <div>
                    <p className="text-xs text-gray-400">Available</p>
                    <p className={`text-lg font-semibold ${isNegative ? 'text-red-700' : 'text-gray-900'}`}>
                        ${balance.toFixed(2)}
                    </p>
                </div>

                {/* Progress bar for savings */}
                {fund && !fund.funded && !fund.overdue && (
                    <>
                        <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                            <div
                                className="h-1 rounded-full"
                                style={{
                                    width: `${Math.min((balance / targetAmount) * 100, 100)}%`,
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>${balance.toFixed(2)}</span>
                            <span>${targetAmount.toFixed(2)}</span>
                        </div>
                    </>
                )}

                {/* Buttons — shortened labels for 2-col layout */}
                <div className="grid grid-cols-3 gap-1">
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'income', envelopeId: id }) }}
                        className="bg-green-50 text-green-800 text-xs font-medium py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        +
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'expense', envelopeId: id }) }}
                        className="bg-red-50 text-red-800 text-xs font-medium py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        −
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'transfer', envelopeId: id }) }}
                        className="bg-blue-50 text-blue-800 text-xs font-medium py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        ⇄
                    </button>
                </div>
            </div>
        </div>
    )
}
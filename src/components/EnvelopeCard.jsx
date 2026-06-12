import { calcSinkingFund } from "../calcSinkingFund"
import { useState } from "react"
export default function EnvelopeCard({ envelope, onOpenModal, onSelect }) {
    const { id, name, balance, color, targetAmount, dueDate } = envelope
    const isNegative = balance < 0
    const fund = calcSinkingFund(balance, targetAmount, dueDate)

    return (
        <div
            onClick={() => onSelect(envelope)}
            className="cursor-pointer"
        >
            {/* Flap */}
            <div
                className="relative rounded-t-sm px-4 pt-3 pb-8 flex items-start justify-between"
                style={{ backgroundColor: color }}
            >
                <span className="text-sm font-medium text-white/90">{name}</span>
                <div className="w-2.5 h-2.5 rounded-full bg-white/50 mt-0.5" />
                {/* Triangle fold */}
                <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: '200px solid transparent',
                        borderRight: '200px solid transparent',
                        borderTop: `28px solid rgba(0,0,0,0.12)`,
                    }}
                />
            </div>

            {/* Body */}
            <div className="bg-white border border-t-0 border-gray-100 rounded-b-xl px-4 pt-3 pb-3 flex flex-col gap-3">

                {/* Balance row */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Available</p>
                        <p className={`text-2xl font-bold ${isNegative ? 'text-red-500' : 'text-gray-900'}`}>
                            ${balance.toFixed(2)}
                        </p>
                    </div>
                    {fund?.funded && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Funded ✓
                        </span>
                    )}
                    {fund && !fund.funded && !fund.overdue && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Save ${fund.perMonth}/mo
                        </span>
                    )}
                    {fund?.overdue && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            Overdue
                        </span>
                    )}
                </div>

                {/* Progress bar — only if sinking fund active */}
                {fund && !fund.funded && !fund.overdue && (
                    <>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-1.5 rounded-full transition-all"
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
                        className="bg-green-50 text-green-700 text-xs font-medium py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        + Income
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'expense', envelopeId: id }) }}
                        className="bg-red-50 text-red-600 text-xs font-medium py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        − Expense
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onOpenModal({ type: 'transfer', envelopeId: id }) }}
                        className="bg-blue-50 text-blue-600 text-xs font-medium py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        ⇄ Transfer
                    </button>
                </div>
            </div>
        </div>
    )
}
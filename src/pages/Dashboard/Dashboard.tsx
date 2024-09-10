// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import CardView from '../component/CardView'; // Periksa path yang benar untuk CardView
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Transaction {
  trans_id: number;
  nomor_rekening: string;
  jns_transaksi: string;
  jumlah_transaksi: number;
  tgl_transaksi: string;
  tujuan_transaksi: string;
  account_id: number;
}

const Dashboard: React.FC = () => {
  const [rekening, setRek] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactionsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    const accountId = Cookies.get("account_id");
    const token = Cookies.get("token");

    if (accountId && token) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`http://api.servernikki.my.id/api/accounts/${accountId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setRek(data.rekening);
            setSaldo(data.saldo);
            setUsername(data.username);
          } else {
            console.error('Failed to fetch profile data');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };

      const fetchTransactions = async () => {
        try {
          const response = await fetch(`http://api.servernikki.my.id/api/history/${accountId}?page=${currentPage}&limit=${transactionsPerPage}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            // Sort transactions by date in descending order
            const sortedTransactions = data.sort((a: Transaction, b: Transaction) => 
              b.trans_id - a.trans_id
            );
            setTransactions(sortedTransactions);
          } else {
            console.error('Failed to fetch transactions');
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };

      fetchProfile();
      fetchTransactions();
    } else {
      navigate('/auth/signin');
    }
  }, [navigate, currentPage]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="absolute top-20 left-5 m-4 w-full">
      <h1 className="text-2xl font-bold mb-6">
        Welcome to RML Bank, {username ? username : 'Guest'}!
      </h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <CardView
          title="Data Rekening Anda"
          content={`Account Number: ${rekening ? rekening : 'Loading...'}`}
          content2={`Balance: ${saldo ? formatCurrency(parseFloat(saldo)) : 'Loading...'}`}
          image="https://via.placeholder.com/500"
          className="w-full sm:w-755 lg:w-120"
        />
        {/* Tambahkan lebih banyak CardView jika diperlukan */}
      </div>

      {/* Transaction History Card */}
      <div className="absolute top-60 w-1/2">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions
                .slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage)
                .map((transaction, index) => (
                  <tr key={transaction.trans_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {((currentPage - 1) * transactionsPerPage) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.tgl_transaksi).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.jns_transaksi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(transaction.jumlah_transaksi)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="w-full flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-md border border-black py-2 px-4 text-center font-medium text-black hover:bg-opacity-90"
            >
              Previous
            </button>
            <span className="self-center text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-4 text-center font-medium text-primary hover:bg-opacity-90"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

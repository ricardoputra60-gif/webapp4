import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';



const Transfer = () => {
  const [nomoeRekeningPenerima, setNomorRekeningPenerima] = useState('')
  const [jumlahTranfer, setJumlahTransfer] = useState('')
  const [nomorRekening, setNomorRekening] = useState('');
  const [accountId, setAccountId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (Cookies.get('token') != null || "") {
      const storedNomorRekening = Cookies.get('rekening');
      const storedAccountId = Cookies.get('account_id');
      if (storedNomorRekening && storedAccountId) {
        setNomorRekening(storedNomorRekening);
        setAccountId(storedAccountId);
      } else {
        setMessage('Error: nomor rekening or account ID not found in localStorage');
      }
    }else{
      navigate('/auth/signin')
    }
  
  })

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    const token = Cookies.get('token'); // Retrieve token from localStorage
  
    if (!token) {
      setMessage('Authentication token not found. Please log in.');
      navigate('/auth/signin');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://api.servernikki.my.id/api/transfer',
        {
          nomor_rekening_pengirim: nomorRekening,
          nomor_rekening_penerima: nomoeRekeningPenerima,
          jumlah_transfer: jumlahTranfer,
          tgl_transaksi: new Date().toISOString().split('T')[0], // Use current date
          account_id_pengirim: parseInt(accountId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token to headers
          },
        }
      );
  
      setMessage(response.data.message);
      setJumlahTransfer(''); // Reset the nominal input
      setNomorRekeningPenerima(''); // Reset the recipient input
      navigate('/');
    } catch (error) {
      console.error('Error transfer:', error);
      setMessage('Failed to transfer');
    }
  };
  
  
  return (
    <div className="absolute top-20 left-5 m-4 w-full">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Transfer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Transfer :
            </label>
            <input
              type="number"
              value={jumlahTranfer}
              onChange={(e) => setJumlahTransfer(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent py-3 px-4 text-black dark:text-white outline-none transition focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipent :
            </label>
            <input
              type="text"
              value={nomoeRekeningPenerima}
              onChange={(e) => setNomorRekeningPenerima(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent py-3 px-4 text-black dark:text-white outline-none transition focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default Transfer;
<script>
        const form = document.getElementById('receiptForm');
        const generateBtn = document.getElementById('generateBtn');
        const printBtn = document.getElementById('printBtn');
        const deleteAllBtn = document.getElementById('deleteAllBtn'); 
        const receiptCard = document.getElementById('receiptCard');
        const historyList = document.getElementById('historyList'); 

        const STORAGE_KEY = 'rentReceipts';

        
        const formatDate = (dateString) => { };
        const formatCurrency = (amount) => { };
        const generateReceiptID = () => { };

        const loadReceipts = () => {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        };

        const saveReceipts = (receipts) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
        };

        const renderHistory = () => {
            historyList.innerHTML = ''; 
            const receipts = loadReceipts();

            if (receipts.length === 0) {
                historyList.innerHTML = '<li>No previous receipts found.</li>';
                deleteAllBtn.setAttribute('disabled', 'disabled');
                return;
            }

            deleteAllBtn.removeAttribute('disabled');
            
            receipts.forEach((receipt, index) => {
                const li = document.createElement('li');
                li.className = 'history-item';
                li.innerHTML = `
                    <div class="history-item-details">
                        ${receipt.id} | ${receipt.tenant} - ${formatCurrency(receipt.amount)} on ${formatDate(receipt.paymentDate)}
                    </div>
                    <button class="delete-one-btn" data-index="${index}">Delete</button>
                `;
                historyList.appendChild(li);
            });
        };

        const deleteReceipt = (index) => {
            const receipts = loadReceipts();
            if (index >= 0 && index < receipts.length) {
                receipts.splice(index, 1); 
                saveReceipts(receipts);
                renderHistory(); 
                receiptCard.classList.add('hidden');
                printBtn.setAttribute('disabled', 'disabled');
            }
        };

        const deleteAllReceipts = () => {
            if (confirm("Are you sure you want to delete all receipt history? This cannot be undone.")) {
                saveReceipts([]); 
                renderHistory();
                receiptCard.classList.add('hidden');
                printBtn.setAttribute('disabled', 'disabled');
            }
        };

        historyList.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('delete-one-btn')) {
                const index = parseInt(e.target.dataset.index);
                deleteReceipt(index);
            }
        });

        deleteAllBtn.addEventListener('click', deleteAllReceipts);

        generateBtn.addEventListener('click', function() {

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const data = {
                id: generateReceiptID(), 
                dateGenerated: new Date().toISOString(), 
                tenant: document.getElementById('tenantName').value,
                address: document.getElementById('propertyAddress').value,
                unit: document.getElementById('unitNumber').value || 'N/A',
                amount: document.getElementById('amountPaid').value,
                paymentDate: document.getElementById('paymentDate').value,
                method: document.getElementById('paymentMethod').value,
                landlord: document.getElementById('landlordName').value,
                notes: document.getElementById('notes').value || 'N/A',
            };

            document.getElementById('receipt-id').textContent = data.id;
            document.getElementById('receipt-date-generated').textContent = formatDate(data.dateGenerated);
            document.getElementById('receipt-tenant').textContent = data.tenant;
            document.getElementById('receipt-address').textContent = data.address;
            document.getElementById('receipt-unit').textContent = data.unit;
            document.getElementById('receipt-amount').textContent = formatCurrency(data.amount);
            document.getElementById('receipt-payment-date').textContent = formatDate(data.paymentDate);
            document.getElementById('receipt-method').textContent = data.method;
            document.getElementById('receipt-landlord').textContent = data.landlord;
            document.getElementById('receipt-notes').textContent = data.notes;

            receiptCard.classList.remove('hidden');
            printBtn.removeAttribute('disabled');

            const receipts = loadReceipts();
            receipts.unshift(data); 
            saveReceipts(receipts);
            renderHistory();
        });

        printBtn.addEventListener('click', function() {
            window.print(); 
        });

        document.addEventListener('DOMContentLoaded', renderHistory);
    </script>

let selectedCoin = 'bitcoin';

document.getElementById('coinSelect').addEventListener('change', (e) => {
    selectedCoin = e.target.value;
    refreshStats();
    refreshDeviation();
});

async function refreshStats() {
    try {
        const response = await fetch(`/stats?coin=${selectedCoin}`);
        const data = await response.json();
        
        if (response.ok) {
            // Update price
            document.querySelector('.price').textContent = 
                `$${formatNumber(data.price)}`;
            
            // Update 24h change
            const changeElement = document.querySelector('.change');
            const change = data['24hChange'];
            changeElement.textContent = `${change.toFixed(2)}%`;
            changeElement.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
            
            // Update market cap
            document.querySelector('.market-cap').textContent = 
                `Market Cap: $${formatNumber(data.marketCap)}`;
        } else {
            alert('Error fetching stats: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch stats. Please try again.');
    }
}

async function refreshDeviation() {
    try {
        const response = await fetch(`/deviation?coin=${selectedCoin}`);
        const data = await response.json();
        
        if (response.ok) {
            document.querySelector('.deviation').textContent = 
                `$${formatNumber(data.deviation)}`;
        } else {
            alert('Error fetching deviation: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch deviation. Please try again.');
    }
}

function formatNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

// Initial data load
refreshStats();
refreshDeviation();
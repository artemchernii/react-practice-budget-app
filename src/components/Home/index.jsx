import { useContext } from 'react';
import { useData } from '../../hooks/hooks';

import { Home as HomeWrapper } from './style';

import Balance from '../Balance';
import Form from '../Form';
import Transactions from '../Transactions/Transactions';
import ErrorBoundary from '../ErrorBoundaries';

import { currencyContext } from '../../providers/context/defaultContext';
import { STATUS } from '../../constants';
import ChangeCurrency from '../ChangeCurrency';

export default function Home() {
    let content;
    const {
        state: { currency },
    } = useContext(currencyContext);
    const {
        transactions,
        balance,
        status,
        addTransaction,
        deleteTransaction,
        favorTransaction,
    } = useData();

    const handleSubmit = ({ balance, date, comment }) => {
        const transaction = {
            label:
                balance > 0 ? 'Balance increased by' : 'Balance decreased by',
            value: +balance,
            date,
            comment,
            id: Date.now(),
            isFavoured: false,
        };
        addTransaction(transaction);
    };

    const onDelete = (id) => {
        deleteTransaction(id);
    };
    const onFavouredClick = (id) => {
        favorTransaction(id);
    };

    const renderedTransactions =
        transactions.length > 0 ? (
            <Transactions
                transactions={transactions}
                onDelete={onDelete}
                onFavouredClick={onFavouredClick}
            />
        ) : null;
    if (status === STATUS.pending) {
        content = <div>Loading...</div>;
    }
    if (status === STATUS.success) {
        content = (
            <HomeWrapper>
                <Balance
                    data-testid="balance"
                    balance={balance}
                    currency={currency}
                />
                <ChangeCurrency />
                <Form handleSubmit={handleSubmit} />
                {renderedTransactions}
            </HomeWrapper>
        );
    }
    if (status === STATUS.error) {
        content = <div>Something went wrong</div>;
    }
    return <ErrorBoundary>{content}</ErrorBoundary>;
}

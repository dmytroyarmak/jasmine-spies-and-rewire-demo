import {
    getPrimaryAccountTransactions,
    __RewireAPI__
} from './accounts-service';

describe('getPrimaryAccountTransactions', () => {
    let returnedPromise;
    let getPrimaryAccountSpy;
    let getPrimaryAccountDefer;
    let getTransactionsSpy;
    let getTransactionsDefer;

    beforeEach(() => {
        // Mock getPrimaryAccount
        getPrimaryAccountDefer = defer();
        getPrimaryAccountSpy = jasmine.createSpy('getPrimaryAccount');
        getPrimaryAccountSpy.and.returnValue(getPrimaryAccountDefer.promise);
        __RewireAPI__.__Rewire__('getPrimaryAccount', getPrimaryAccountSpy);

        // Mock getTransactions
        getTransactionsDefer = defer();
        getTransactionsSpy = jasmine.createSpy('getTransactions');
        getTransactionsSpy.and.returnValue(getTransactionsDefer.promise);
        __RewireAPI__.__Rewire__('getTransactions', getTransactionsSpy);

        returnedPromise = getPrimaryAccountTransactions();
    });

    afterEach(() => {
        __RewireAPI__.__ResetDependency__('getPrimaryAccount');
        __RewireAPI__.__ResetDependency__('getTransactions');
    });

    it('should call getPrimaryAccount', () => {
        expect(getPrimaryAccountSpy).toHaveBeenCalled();
    })

    describe('when getPrimaryAccount succeed', () => {
        let primaryAccountFixture;

        beforeEach((done) => {
            primaryAccountFixture = {id: 42};
            getPrimaryAccountDefer.resolve(primaryAccountFixture);
            getPrimaryAccountDefer.promise.then(done);
        });

        it('should call getTransactions with correct id', () => {
            expect(getTransactionsSpy).toHaveBeenCalledWith(primaryAccountFixture.id);
        });

        describe('when getTransactions succeed', () => {
            let transactionsFixture;

            beforeEach((done) => {
                transactionsFixture = [
                    {id: 1, amount: 100, name: 'First transaction'},
                    {id: 2, amount: 200, name: 'Second transaction'},
                ];
                getTransactionsDefer.resolve(transactionsFixture);
                getTransactionsDefer.promise.then(done);
            });

            describe('returned promise', () => {
                it('should be resolved with correct transactions', (done) => {
                    returnedPromise.then((result) => {
                        expect(result).toBe(transactionsFixture);
                        done();
                    });
                });
            });
        });
    });
});

// Test helpers
function defer() {
    var resolve, reject;
    var promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}

#include <iostream>
#include <vector>
#include <set>
#include <algorithm>
#include <functional>

using namespace std;

template<class ForwardIterator>
bool check_sorted(ForwardIterator begin, ForwardIterator end) {
    ForwardIterator previous = begin;
    while (++begin != end) {
        if (*previous > *begin) {
            return false;
        }
    }
    return true;
}

class TestClass {
  public:
    void method(double a) {}
    void method(int c) {}
    template<class T>
    void method(T begin, T end) {}
    void method(char c, int d);
    void other_method(int w);
};

int main() {
    cout << "hello!" << endl;
    
    vector<int> vec;

    for (int i = 0; i < 10; ++i) {
        vec.push_back(i * i);
    }

    random_shuffle(vec.begin(), vec.end());

    set<int> s;
    for (vector<int>::iterator it = vec.begin(); it != vec.end(); ++it) {
        s.insert(*it);
    }

    cout << "is set sorted? " << check_sorted(s.begin(), s.end()) << endl;

    TestClass testClass;

    return 0;
}

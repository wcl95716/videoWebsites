import multiprocessing

# 定义全局变量 x
x = 0

def worker():
    # 在子进程中访问全局变量 x
    print('x in worker:', x)

def update_x(pool):
    # 更新全局变量 x 的值
    global x
    x = 10

    # 向进程池中添加任务
    pool.apply_async(worker)

if __name__ == '__main__':
    # 创建进程池，设置进程数为 2
    pool = multiprocessing.Pool(2)

    # 调用 update_x 函数更新全局变量 x 的值，并向进程池中添加任务
    update_x(pool)

    # 关闭进程池，等待所有任务执行完毕
    pool.close()
    pool.join()

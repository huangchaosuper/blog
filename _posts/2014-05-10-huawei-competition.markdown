---
layout: post
title: "第六届华为创新杯编程大赛-第三轮"
date: 2014-05-10 20:23:00
categories: life
tags: 竞赛
---

第六届华为创新杯编程大赛-第三轮 成都麻将胡牌规则+吐槽

##题目

成都麻将胡牌规则

描述: 说起麻将，那可是川渝市民的最爱，无论亲朋好友聚会，还是业务谈判，总是少不了麻将的声音。 成都麻将只能包括3种类型：条，筒，万。没有“门、东南西北、红中”。 每种牌都是数字从1到9，每个数字有4张，共36张。筒，万，条均一样。 

胡牌简化规则如下： 

1.必须有一个对子，即两张相同的牌，比如：两个2筒，两个4条等。 

2.剩余的牌，每3张需要凑成一个有效牌，比如：3个一样的牌(3个2筒)，或者3个顺子(1条2条3条)，如果所有的牌都能够凑好，再满足规则2和1，有一个对子，并且所有的牌只有两种类型，那么就可以胡牌了。 

3.假设牌不会出现碰的情况，即输入的牌肯定是13张。 

4.输入牌肯定都是麻将牌，不用考虑异常输入；也不用考虑会输入“门”，“红中”等成都麻将中不会出现的牌。

5.条用T表示，D用D表示，万用W标识。 

6.不用考虑输入的合法性，这个由函数的使用者保证。输入的牌为字符串，字母为大写的TDW” 要求根据13个已知输入，判断可以胡那几张牌。

输入:输入13张麻将牌，如"1T8T6W6W5D4W1T3W6W2W5D6T1T"

输出:

输出胡牌个数和要胡的牌， 其中胡牌个数占一行输出，胡哪一张牌占一行输出， 胡多张牌，输出数促按照T/D/W的顺序从小到大排列（如1T5T6D7D3W8W）。

1 7T

样例输入：

1T8T6W6W5D4W1T3W6W2W5D6T1T

样例输出：

1

7T


##解题思路

通过题目的分析，大家可以猜到此问题为规则问题。

最开始，笔者方向错误，按照正常的思维执行规则，2个小时的比赛，进入最后一小时的时候，笔者发现思维错误，决定重写算法。

这里就直接说一下最后的解题思路

##源代码（TBD）

{% highlight Java %}

import com.sun.crypto.provider.TlsKeyMaterialGenerator;

import java.util.*;
public class project1 {
    public static void main( String[] args ) {
        Scanner cin = new Scanner(System.in);
        List<String> keys = new ArrayList<String>();
        if (cin.hasNext()){
            String inputKeys = cin.nextLine();
            for(int i = 0;i<13;i++){
                String key = inputKeys.substring(2*i,2*i+2);
                keys.add(key);
            }
        }
        List<String> active = new ArrayList<String>();
        List<String> anotherKeys = createAnotherKeys();
        for(String anotherKey:anotherKeys){
            if(validate1(keys,anotherKey)||validate2(keys, anotherKey)||validate3(keys, anotherKey)){
                if(!active.contains(anotherKey)){
                    active.add(anotherKey);
                }
            }
        }
        System.out.println(active.size());
        String output = "";
        for(String item: active){
            output+=item;
        }
        System.out.println(output);
    }

    public static List<String> createAnotherKeys(){
        List<String> anotherKey = new ArrayList<String>();
        for(int i = 1;i<=9;i++){
            String temp = String.valueOf(i)+"T";
            anotherKey.add(temp);
        }
        for(int i = 1;i<=9;i++){
            String temp = String.valueOf(i)+"D";
            anotherKey.add(temp);
        }
        for(int i = 1;i<=9;i++){
            String temp = String.valueOf(i)+"W";
            anotherKey.add(temp);
        }
        return anotherKey;
    }

    public static boolean validate1(List<String> inputKeys,String anotherKey){
        List<String> newKeys = new ArrayList<String>(inputKeys);
        newKeys.add(anotherKey);
        newKeys = remove3same(newKeys);
        newKeys = remove3diff(newKeys);
        if(newKeys.size() == 2){
            if(newKeys.get(0).equals(newKeys.get(1))){
                return true;
            }
        }
        return false;
    } 
    public static boolean validate2(List<String> inputKeys,String anotherKey){
        List<String> newKeys = new ArrayList<String>(inputKeys);
        newKeys.add(anotherKey);
        newKeys = remove3diff(newKeys);
        newKeys = remove3same(newKeys);
        if(newKeys.size() == 2){
            if(newKeys.get(0).equals(newKeys.get(1))){
                return true;
            }
        }
        return false;
    }
    public static List<String> remove3same(List<String> inputKeys){
        //删除三张相同牌
    }
    public static List<String> remove3diff(List<String> inputKeys){
        //删除三张顺子牌
    }
}
{% endhighlight %}

因为时间原因，还有一种单调将的规则没来得及加上validate3，大概思路是，遍历13张牌，遍历减掉一张牌。执行remove3same和remove3diff，如果返回结果是空，表示可以叫胡，叫胡牌位减掉的那一张。

另外13+1的算法漏下了某个牌>4(=5)的检测过滤，可能会影响成绩。

##吐槽

现在进入吐槽阶段。。。

一如既往的卡顿。因为最后一小时更改算法，提前了10分钟提交了一个过得去的算法保底。奇迹有一次发生了。。。我提交的结果编译错误，哥哥，我本地编译通过了呀，而且给出的测试样例也是通过的，至少是有分的吧。。。另外，只给出编译错误，到底是什么错误啊。。。。

由于这个突发状况，索性稍微改了一下，在没有完全完成所有思路代码的情况下匆匆第二次提交。这个时候卡顿严重了，因为还剩下5分钟到时间。

最终第二次提交成功，但是没有等到最后分数出来，账户就失效了。所以，我到底得了多少分可能将是一个迷了。


今天公司组织旅游，刚好和比赛冲突，一边是约定好的女朋友，一边是比赛，边旅游边比赛，那是相当不容易啊。。。
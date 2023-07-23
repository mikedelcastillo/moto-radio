shopt -s extglob

rm -rf ./arduino/*/lib
for d in ./arduino/!(lib)/   
do    
    dir=$(basename "$d")
    echo $dir
    ln -s ../lib ./arduino/$dir
done
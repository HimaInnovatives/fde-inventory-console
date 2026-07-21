package com.fde;
import java.util.Scanner;

public class InventoryApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;
        System.out.println("\n=== FDE Unified Database Storage System ===");

        while (running) {
            System.out.println("\nSelect: 1) Save to DB  2) View from DB  3) Exit");
            System.out.print("Enter choice: ");
            int choice = scanner.nextInt();
            scanner.nextLine();

            if (choice == 1) {
                System.out.print("Enter product name: ");
                String name = scanner.nextLine();
                DatabaseManager.saveItem(name);
                System.out.println("\u2714 Saved to PostgreSQL!");
            } else if (choice == 2) {
                System.out.println("\n--- Current Live Database Records ---");
                for (Item item : DatabaseManager.getAllItems()) {
                    System.out.println("ID: " + item.getId() + " | Name: " + item.getName());
                }
            } else if (choice == 3) {
                running = false;
                System.out.println("Exiting. Goodbye!");
            }
        }
        scanner.close();
    }
}
